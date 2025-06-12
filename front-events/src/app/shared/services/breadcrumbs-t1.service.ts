import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface BreadcrumbEntry {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsT1Service {
  private readonly STORAGE_KEY = 'breadcrumb-history';
  private readonly MAX_HISTORY_LENGTH = 5;

  private breadcrumbs: WritableSignal<BreadcrumbEntry[]> = signal([]);
  public breadcrumbSignal: Signal<BreadcrumbEntry[]> = computed(() => this.breadcrumbs());

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Cargar historial inicial desde localStorage
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.breadcrumbs.set(JSON.parse(stored));
    }

    // Escuchar cambios de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumbs(this.activatedRoute.root);
    });
  }

  private updateBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbTrail: BreadcrumbEntry[] = []
  ): void {
    const children = route.children;
    console.log(children);
    if (children.length === 0) {
      // Fin de la cadena, guardar en historial
      if (breadcrumbTrail.length > 0) {
        const lastBreadcrumb = breadcrumbTrail[breadcrumbTrail.length - 1];

        const currentHistory = this.breadcrumbs();
        const isDuplicate = currentHistory.length > 0 &&
          currentHistory[currentHistory.length - 1].url === lastBreadcrumb.url;

        if (!isDuplicate) {
          const updated = [...currentHistory, lastBreadcrumb].slice(-this.MAX_HISTORY_LENGTH);
          this.breadcrumbs.set(updated);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
        }
      }
      return;
    }

    for (const child of children) {
      const segment = child.snapshot.url.map(s => s.path).join('/');
      if (segment) {
        url += `/${segment}`;
      }

      const label = child.snapshot.data['breadcrumb'] || 'Sin nombre';

      if (label) {
        breadcrumbTrail.push({ label, url });
      }

      return this.updateBreadcrumbs(child, url, breadcrumbTrail);
    }
  }

  public getHistory(): BreadcrumbEntry[] {
    return this.breadcrumbs();
  }

  public clearHistory(): void {
    this.breadcrumbs.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  
}
