import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { first, takeUntil } from 'rxjs';

import { UpdateGenreDto } from '../../../../core/dto/genres';
import { DropdownOptionDto } from '../../../../core/dto/media';
import { DestroyService, GenresService, ItemDataService } from '../../../../core/services';

interface UpdateGenreForm {
  name: FormControl<string>;
  isTranslation: FormControl<boolean>;
  translate: FormControl<string>;
}

@Component({
  selector: 'app-update-genre',
  templateUrl: './update-genre.component.html',
  styleUrls: ['./update-genre.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ItemDataService, DestroyService]
})
export class UpdateGenreComponent implements OnInit {
  updatingGenre: boolean = false;
  updateGenreForm: FormGroup<UpdateGenreForm>;
  translateOptions: DropdownOptionDto[] = [];

  constructor(private ref: ChangeDetectorRef, private dialogRef: DynamicDialogRef, private config: DynamicDialogConfig,
    private genresService: GenresService, private itemDataService: ItemDataService, private destroyService: DestroyService) {
    this.updateGenreForm = new FormGroup<UpdateGenreForm>({
      name: new FormControl(this.config.data['name'] || '', { nonNullable: true, validators: [Validators.required, Validators.maxLength(32)] }),
      isTranslation: new FormControl(false, { nonNullable: true }),
      translate: new FormControl({ value: 'vi', disabled: true }, { nonNullable: true })
    });
  }

  ngOnInit(): void {
    this.itemDataService.createTranslateOptions().pipe(first()).subscribe({
      next: options => this.translateOptions = options
    });
  }

  onUpdateGenreFormSubmit(): void {
    if (this.updateGenreForm.invalid) return;
    this.updatingGenre = true;
    const formValue = this.updateGenreForm.getRawValue();
    const params: UpdateGenreDto = {
      name: formValue.name
    };
    formValue.isTranslation && (params.translate = this.updateGenreForm.value.translate);
    this.genresService.update(this.config.data['_id'], params).pipe(takeUntil(this.destroyService)).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.updatingGenre = false;
        this.ref.markForCheck();
      }
    });
  }

  onUpdateGenreFormCancel(): void {
    this.dialogRef.close(false);
  }

}
