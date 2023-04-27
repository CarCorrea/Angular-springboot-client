import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Client } from '../model/client';
import { ClientService } from '../service/client.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'client-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  @Input() client: Client;
  title: string = "Select your profile pic";
  selectedImage: File;
  progress: number = 0;

  constructor(private clientService: ClientService, protected modalService: ModalService) { }

  ngOnInit(): void {

  }

  selectImage(event) {
    this.selectedImage = event.target.files[0];
    this.progress = 0;
    console.log(this.selectedImage);
    if (this.selectedImage.type.indexOf('image') < 0) {
      Swal.fire('Error selecting image', `The file selected must be an image`, 'error')
    } else {

    }
  }

  uploadImage() {

    if (!this.selectedImage) {
      Swal.fire('Error', `Please select a profile picture to upload`, 'error')
    } else {
      this.clientService.uploadProfilePic(this.selectedImage, this.client.id)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((event.loaded / event.total) * 100)
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.client = response.client as Client;

            this.modalService.notifyUpload.emit(this.client);
            Swal.fire('Image uploaded!', response.message, 'success')
          }
        });
    }
  }

  closeModal() {
    this.modalService.closeModal();
    this.selectedImage = null;
    this.progress = 0;
  }

}
