import { UserService } from './../../@Services/user.service';
import { Component } from '@angular/core';
import { User } from '../../@Interface/user';
import { SchoolCommunityLayoutComponent } from '../school-community-layout/school-community-layout.component';
import { ActivatedRoute } from '@angular/router';
import { EduApiGovService } from '../../@Services/edu-api-gov.service';

@Component({
  selector: 'app-school-community-member',
  imports: [],
  templateUrl: './school-community-member.component.html',
  styleUrl: './school-community-member.component.scss'
})
export class SchoolCommunityMemberComponent {
  constructor(
  private route: ActivatedRoute,
  private eduApiGovService: EduApiGovService,
  private userService: UserService
) {}

  ngOnInit(): void {
    const schoolId = Number(
      this.route.parent?.snapshot.paramMap.get('id')
    );

    this.eduApiGovService.getSchools().subscribe(data => {

      const school = data.find(
        s => Number(s['代碼']) === schoolId
      );

      if (!school) return;

      const schoolName = school['學校名稱'];

      this.userService
        .getUserDataBySchool(schoolName)
        .subscribe(res => {
          this.classmate = res.user ?? [];
        });
    });
  }

  classmate: User[] = [];

}
