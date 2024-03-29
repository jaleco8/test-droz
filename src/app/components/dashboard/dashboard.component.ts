import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  showUserMenu = false;
  profile: any;
  listUsers: any;
  listVentas: any;
  listVentasFiltrada: any;
  ListaProductos: string[] = [];
  totalVentas = 0;
  totalVentasOld = 0;
  tokenApi: string = '';
  cal: any = {};
  month = new Date().getMonth();
  year = new Date().getFullYear();
  filtroFecha: string = 'month';

  filter: string[] = [];

  constructor(
    private authGoogleService: AuthGoogleService,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    if (!this.profile) {
      setTimeout(() => {
        this.validateAccess();
      }, 1500);
    }
  }

  showData() {
    this.profile = this.authGoogleService.getProfile();
  }

  validateAccess() {
    this.authGoogleService.authUser().subscribe({
      next: (data) => {
        console.log('Token', data);

        if (data.error === 'Invalid Google token') {
          this.router.navigate(['/login']);
        } else {
          this.tokenApi = data.token;
        }
      },
      error: (error) => {
        console.error(error);
        this.logout();
      },
      complete: () => {
        this.showData();
        this.loadData();
      },
    });
  }

  loadData() {
    this.dashboardService.getUsers(this.tokenApi).subscribe((data) => {
      this.listUsers = data;
    });
    this.dashboardService.getVentas(this.tokenApi).subscribe((data) => {
      this.listVentas = data;
      this.listVentasFiltrada = data;

      this.filtrarFecha(this.filtroFecha);
      //Lista de productos
      this.listVentas.forEach((element: { producto: any; }) => {
        this.ListaProductos.push(element.producto);
      });
      const set = new Set(this.ListaProductos);
      this.ListaProductos = Array.from(set);
      this.calculoVentas();
    });
  }

  calculoVentas() {
    const ventasActuales = this.listVentas.filter((venta: any) => {
      return new Date(venta.fecha).getFullYear() === new Date().getFullYear();
    });

    const ventasAnteriores = this.listVentas.filter((venta: any) => {
      return (
        new Date(venta.fecha).getFullYear() === new Date().getFullYear() - 1
      );
    });

    for (let i = 0; i < ventasActuales.length; i++) {
      let total = parseFloat(ventasActuales[i].total);
      this.totalVentas += total;
    }

    for (let i = 0; i < ventasAnteriores.length; i++) {
      let total = parseFloat(ventasAnteriores[i].total);
      this.totalVentasOld += total;
    }

    //Calcular el porcentaje de crecimiento o decrecimiento
    this.totalVentasOld = this.totalVentasOld === 0 ? 1 : this.totalVentasOld;
    const porcentaje =
      (this.totalVentas - this.totalVentasOld) / this.totalVentasOld;

    this.cal = {
      porcentaje: porcentaje,
      color:
        porcentaje > 0
          ? 'bg-green-100 p-1 text-green-600'
          : 'bg-red-100 p-1 text-red-600',
      icono:
        porcentaje > 0
          ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
          : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6',
    };
  }

  userMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authGoogleService.logout();
    this.router.navigate(['/login']);
  }

  searchFilter(event: any) {

    if(event.target.checked) {
      this.filter.push(event.target.value)
    } else {
      //remover del array filter el valor que se desmarco
      let index = this.filter.indexOf(event.target.value);
      this.filter.splice(index, 1);
    }

    this.filtrarFecha(this.filtroFecha);
    // filtrar this.listVentas
    this.listVentasFiltrada = this.listVentasFiltrada.filter((venta: any) => {
      return this.filter.includes(venta.producto);
    });
  }

  clearFilter() {
    this.filter = [];
    this.filtroFecha = 'month';
    this.listVentasFiltrada = this.listVentas;
    //todos los checkbox se desmarcan
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });
  }

  filtrarFecha(filtro: string) {
    if(filtro === 'month') {
      // Filtar por mes y año
      this.filtroFecha = 'month';
      this.listVentasFiltrada = this.listVentas.filter((venta: any) => {
        return new Date(venta.fecha).getMonth() === this.month && new Date(venta.fecha).getFullYear() === this.year;
      });
    } else {
      this.filtroFecha = 'year';
      this.listVentasFiltrada = this.listVentas.filter((venta: any) => {
        return new Date(venta.fecha).getFullYear() === this.year;
      });
    }
  }
}
