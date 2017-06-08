import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserDetailService } from '../user-detail/user-detail.service';
import { ProfileService } from './profile.service';
import { User } from '../models/user';
import { colors, userTypes } from '../app.constants';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
	providers: [UserDetailService, ProfileService]
})
export class ProfileComponent implements OnInit {
	userTypes: string[];
	userId: string;
	user = new User;
	userSrc: string;
	formatedUserBirth: string;
	privateUser: boolean = true;
	selectedAlbum: number = 0;
	photos: any[] = [{ album: 'background', array: [], selected: '' }, 
					 { album: 'profile', array: [], selected: '' },
					 { album: 'other', array: [], selected: '' }];

	constructor(private auth: AuthGuard, private location: Location, private router: Router, private activatedRoute: ActivatedRoute, private userDetailService: UserDetailService, private profileService: ProfileService) {
		this.userTypes = userTypes;
		this.activatedRoute.params.subscribe((params: Params) => {
        	this.userId = params['id'];
        });
	}

	ngOnInit() {
		if ( this.userId !== undefined && this.userId !== '' ) {
			if ( this.userId === this.auth.getUser._id ) {
				this.user = this.auth.getUser;
			} else {
				this.fetchUser();
				this.privateUser = false;
			}
			this.userSrc = '/media/' + this.userId + '/';
		} else {
			this.auth.updateUser();
			this.user = this.auth.getUser;
			this.userSrc = '/media/' + this.user._id + '/';
		}

		let userBirthDay = new Date(this.user.birthDay);
		this.formatedUserBirth = ''
			+ ((userBirthDay.getDate() + 1 < 10) ? '0' + (userBirthDay.getDate() + 1).toString() : (userBirthDay.getDate() + 1).toString()) + '/'
			+ ((userBirthDay.getMonth() + 1 < 10) ? '0' + (userBirthDay.getMonth() + 1).toString() : (userBirthDay.getMonth() + 1).toString()) + '/'
			+ (userBirthDay.getFullYear()).toString();

		for ( let i = this.user.photos.length - 1 ; i >= 0 ; i-- ) {
			let item = this.user.photos[i];
			for ( let j = 0 ; j < this.photos.length ; j++ ) {
				let sub_item = this.photos[j];
				if ( sub_item.album === item.album ) {
					sub_item.array.push(this.userSrc + sub_item.album + '/' + item.name);
					let albumCheck = '';
					let srcCheck = '';
					if ( sub_item.album == 'background' ) {
						albumCheck = 'background';
						srcCheck = this.userSrc + 'background/' + this.user.backPhoto;
					} else if ( sub_item.album == 'profile' ) {
						albumCheck = 'profile';
						srcCheck = this.userSrc + 'profile/' + this.user.profilePhoto;
					}
					for ( let check in sub_item.array ) {
						if ( albumCheck === sub_item.album ) {
							if ( sub_item.array[check] === srcCheck ) {
								sub_item.selected = sub_item.array.indexOf(sub_item.array[check]);
							}
						}
					}
				}
			}
		}
	}

	fetchUser(): void {
		this.userDetailService.getUser(this.userId)
			.subscribe( user => { 
					this.user = user;
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
					alert('Hubo un error al actualizar la foto');
				});
		console.log(album + '  '  + name);
	}

}
