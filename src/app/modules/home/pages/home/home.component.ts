import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import { Media, Paginated } from '../../../../core/models';
import { MediaService } from '../../../../core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MediaService]
})
export class HomeComponent implements OnInit {
  loadingFeaturedMedia: boolean = false;
  loadingMediaList: boolean = false;
  loadingMediaTop: boolean = false;
  featuredMedia?: Media[];
  mediaList?: Paginated<Media>;
  mostViewedMedia?: Paginated<Media>;

  constructor(private ref: ChangeDetectorRef, private meta: Meta, private mediaService: MediaService) { }

  ngOnInit(): void {
    this.meta.addTags([
      {
        name: 'description',
        content: 'KamPlex Version 2'
      },
      {
        property: 'og:site_name',
        content: 'KamPlex'
      },
      {
        property: 'og:title',
        content: 'KamPlex - Home'
      },
      {
        property: 'og:description',
        content: 'KamPlex v2 Dev Test'
      }
    ]);
    this.loadingFeaturedMedia = true;
    this.loadingMediaList = true;
    this.loadingMediaTop = true;
    this.mediaService.findPage().subscribe({
      next: data => {
        this.featuredMedia = data.results.slice(0, 5);
        this.mediaList = data;
        this.mostViewedMedia = {
          ...data,
          results: data.results.slice(0, 5)
        };
        this.ref.markForCheck();
      }
    }).add(() => {
      this.loadingFeaturedMedia = false;
      this.loadingMediaList = false;
      this.loadingMediaTop = false;
    });
  }

}
