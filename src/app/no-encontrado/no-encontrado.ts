import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink],
  styleUrl: './no-encontrado.css',
  templateUrl: './no-encontrado.html',
})
export class NoEncontrado {
  private readonly router = inject(Router);

  protected readonly url = this.router.url;
}
