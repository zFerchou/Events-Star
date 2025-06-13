import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { CityService } from '../../../cities/services/cities.service';
import { AreaService } from '../../../areas/services/area.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['../../../users/components/login/login.component.css', './event-form.component.css']


})
export class EventFormComponent implements OnInit {
  ngOnInit(): void {
    // Suscribirse a cambios en el área de interés
    this.myForm.get('areaInteres')?.valueChanges.subscribe(areaId => {
      const selectedArea:any = this.areas().find(area => area._id === areaId);
      this.categories = selectedArea!.categorias;
      console.log(selectedArea)
      // Reiniciar categoría seleccionada al cambiar de área
      this.myForm.get('category')?.setValue('');
    });
  }
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private citiesService = inject(CityService);
  private areaService = inject(AreaService);
  cities = computed(this.citiesService.ciudades)
  areas = computed(this.areaService.areas);
  categories = [];

  myForm: FormGroup = this.fb.group({
    eventName: ['', [Validators.required, Validators.minLength(3)]],
    date: ['', Validators.required],
    city: ['', Validators.required],
    areaInteres: ['', Validators.required],
    category: ['', Validators.required],
    maxCapacity: [1, [Validators.required, Validators.min(1)]],
    image: [null],  // Aquí guarda la imagen
  });

  selectedFile?: File;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      this.selectedFile = undefined;
      this.myForm.patchValue({ image: null });
      return;
    }
    this.selectedFile = input.files[0];
    this.myForm.patchValue({ image: this.selectedFile });
    this.myForm.get('image')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    // Construimos FormData para enviar con la imagen
    const formData = new FormData();
    formData.append('eventName', this.myForm.get('eventName')?.value);
    formData.append('date', this.myForm.get('date')?.value);
    formData.append('city', this.myForm.get('city')?.value);
    formData.append('areaInteres', this.myForm.get('areaInteres')?.value);
    formData.append('category', this.myForm.get('category')?.value);
    formData.append('maxCapacity', this.myForm.get('maxCapacity')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    // Aquí deberías llamar a tu servicio Angular para enviar formData al backend
    // Ejemplo:
    this.eventService.crearEvento(formData).subscribe(res => {
      const { data } = res;
      console.log(res);
    });

    console.log('FormData preparado para enviar:', formData);

    // Reiniciamos formulario y archivo
    this.myForm.reset({ maxCapacity: 1 });
    this.selectedFile = undefined;
  }
}
