import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EduApiGovService } from '../../@Services/edu-api-gov.service';
import { UserService } from '../../@Services/user.service';

@Component({
  selector: 'app-school-community-seeking',
  imports: [],
  templateUrl: './school-community-seeking.component.html',
  styleUrl: './school-community-seeking.component.scss'
})
export class SchoolCommunitySeekingComponent {

  constructor(
    private route: ActivatedRoute,
    private eduApiGovService: EduApiGovService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const schoolId = this.route.snapshot
    this.eduApiGovService.getSchools()
  }

}
