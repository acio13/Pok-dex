import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonHomeService } from '../../services/pokemon-home.service';

@Component({
  selector: 'app-home-compatibility',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-compatibility" [class]="compatibilityClass">
      <div class="home-icon">
        <svg viewBox="0 0 24 24" class="home-logo">
          <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.16.21 2.34.21 3.5 0 5.16-1 9-5.45 9-11V7l-10-5z" 
                [attr.fill]="iconColor"/>
          <circle cx="12" cy="12" r="3" fill="white"/>
          <text x="12" y="16" text-anchor="middle" font-size="6" fill="white">H</text>
        </svg>
      </div>
      <div class="compatibility-info" *ngIf="showDetails">
        <span class="status-text">{{ statusMessage }}</span>
        <div class="restrictions" *ngIf="hasRestrictions">
          <small>{{ restrictionDetails }}</small>
        </div>
      </div>
      <div class="simple-indicator" *ngIf="!showDetails">
        <span class="status-dot" [style.background-color]="iconColor"></span>
      </div>
    </div>
  `,
  styleUrls: ['./home-compatibility.component.scss']
})
export class HomeCompatibilityComponent {
  @Input() pokemonId!: number;
  @Input() form?: string;
  @Input() showDetails = false;

  constructor(private homeService: PokemonHomeService) {}

  get compatibilityClass(): string {
    const status = this.homeService.getCompatibilityIcon(this.pokemonId, this.form);
    return `compatibility-${status}`;
  }

  get iconColor(): string {
    return this.homeService.getCompatibilityColor(this.pokemonId, this.form);
  }

  get statusMessage(): string {
    return this.homeService.getCompatibilityMessage(this.pokemonId, this.form);
  }

  get hasRestrictions(): boolean {
    return this.homeService.hasFormRestrictions(this.pokemonId);
  }

  get restrictionDetails(): string {
    const info = this.homeService.getCompatibilityInfo(this.pokemonId);
    if (!info || info.restrictedForms.length === 0) {
      return '';
    }
    return `Forme con restrizioni: ${info.restrictedForms.join(', ')}`;
  }
}