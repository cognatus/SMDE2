import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserDetailService } from '../admin/user-detail/user-detail.service';
import { ProfileService } from './profile.service';

import { User } from '../_models/user';
import { Colors, userTypes, formatedDate } from '../app.constants';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
	providers: [UserDetailService, ProfileService]
})
export class ProfileComponent implements OnInit {
	userTypes: string[];
	userId: string;
	user = new User();
	userSrc: string;
	formatedUserBirth: string;
	privateUser: boolean = true;
	selectedAlbum: number = 0;
	colors = new Colors();
	photos: any[] = [{ album: 'background', array: [], selected: '' }, 
					 { album: 'profile', array: [], selected: '' },
					 { album: 'other', array: [], selected: '' }];

	constructor(private auth: AuthGuard, private location: Location, private router: Router, private activatedRoute: ActivatedRoute, private userDetailService: UserDetailService, private profileService: ProfileService) {
		this.userTypes = userTypes;
		this.activatedRoute.params.subscribe((params: Params) => {
        	this.userId = params['id'];
        });
        if ( this.userId !== undefined && this.userId !== '' ) {
			if ( this.userId !== this.auth.getUser()._id ) {
				this.privateUser = false;
			}
		}
	}

	ngOnInit() {
		this.fetchUser( () => {
			this.userSrc = '/media/' + this.user._id + '/';
			for ( let i = this.user.photos.length - 1 ; i >= 0 ; i-- ) {
				let item = this.user.photos[i];
				for ( let j = 0 ; j < this.photos.length ; j++ ) {
					let sub_item = this.photos[j];
					sub_item.selected = 0;
					if ( sub_item.album === item.album ) {
						sub_item.array.push(this.userSrc + sub_item.album + '/' + item.name);
					}
				}
			}
			let srcCheck = '';
			let profAttr = '';
			for ( let j = 0 ; j < this.photos.length ; j++ ) {
				let sub_item = this.photos[j];
				if ( sub_item.album == 'background' ) {
					profAttr = this.user.profilePhoto;
					srcCheck = this.userSrc + 'background/' + this.user.backPhoto;
				} else if ( sub_item.album == 'profile' ) {
					profAttr = this.user.backPhoto;
					srcCheck = this.userSrc + 'profile/' + this.user.profilePhoto;
				}
				if ( profAttr !== undefined && profAttr !== null ) {
					sub_item.selected = sub_item.array.indexOf(srcCheck);			
				}
			}
		});
	}

	fetchUser( callback: () => void ): void {
		let id = this.privateUser ? this.auth.getUser()._id : this.userId;

		this.userDetailService.getUser(id)
			.subscribe( user => { 
					this.user = user;
					callback();
				}, error => {
					console.log(error);
				});
	}

	passImg( status: boolean, gallery: string ): void {
		for ( let item in this.photos ) {
			if ( gallery === this.photos[item].album ) {
				if ( status ) {
					this.photos[item].selected++;
					if ( this.photos[item].selected == this.photos[item].array.length ) {
						this.photos[item].selected = 0;
					}
				} else {
					this.photos[item].selected--;
					if ( this.photos[item].selected == -1 ) {
						this.photos[item].selected = this.photos[item].array.length - 1;
					}
				}
			}
		}
	}

	changePhoto(): void {
		let album = this.photos[this.selectedAlbum].album;
		let nameSrcArray = this.photos[this.selectedAlbum].array[this.photos[this.selectedAlbum].selected].split('/'); 
		let name = nameSrcArray[nameSrcArray.length - 1];

		this.profileService.updatePhoto(album, name)
			.subscribe( response => {
					location.reload();
				}, error => {
					console.log('Error');
				});
	}

	deletePhoto(): void {
		let album = this.photos[this.selectedAlbum].album;
		let nameSrcArray = this.photos[this.selectedAlbum].array[this.photos[this.selectedAlbum].selected].split('/'); 
		let name = nameSrcArray[nameSrcArray.length - 1];

		this.profileService.deletePhoto(album, name)
			.subscribe( response => {
					location.reload();
				}, error => {
					console.log('Error');
					alert('Hubo un error al eliminar la foto');
				});
	}

}
