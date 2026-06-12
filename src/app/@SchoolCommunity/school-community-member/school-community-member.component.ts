import { UserService } from './../../@Services/user.service';
import { Component } from '@angular/core';
import { User } from '../../@Interface/user';
import { ActivatedRoute } from '@angular/router';
import { EduApiGovService } from '../../@Services/edu-api-gov.service';
import { RouterLink } from '@angular/router';

import {
  LucideAngularModule,
  MessageCircleMore, Flag
} from 'lucide-angular';
import { ReportService } from '../../@Services/report.service';

@Component({
  selector: 'app-school-community-member',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './school-community-member.component.html',
  styleUrl: './school-community-member.component.scss'
})
export class SchoolCommunityMemberComponent {

  readonly MessageCircleMore = MessageCircleMore;
  readonly Flag = Flag;

  constructor(
    private reportService: ReportService,
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
  memberId = '';
  memberName = '';

  // 檢舉
  goRepot() {
    // 檢舉用戶
    this.reportService.openReportDialog('user', this.memberName, this.memberId);
  }

}
