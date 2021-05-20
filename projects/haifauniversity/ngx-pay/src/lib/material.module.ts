import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

const MAT_MODULES = [MatFormFieldModule, MatInputModule, MatButtonModule];

@NgModule({
  imports: MAT_MODULES,
  exports: MAT_MODULES,
})
export class MaterialModule {}
