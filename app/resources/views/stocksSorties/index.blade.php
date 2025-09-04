@extends('layouts.app')
@section('title', 'Sorties de Stock')
@section('Page-title', 'Sorties de Stock' )

@section('content')
<div class="container-fluid py-2">
    <!-- En-tête -->
    <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="mb-0">
            <i class="bi bi-box-arrow-up me-2"></i> Sorties de Stock
        </h5>
        <button class="btn btn-sm btn-danger" type="button" data-bs-toggle="collapse" data-bs-target="#formCollapse">
            <i class="bi bi-dash-circle me-1"></i> Enregistrer une sortie
        </button>
    </div>

    <!-- Formulaire Collapse -->
    @include('stocksSorties.create')
    <!-- Filtres -->
    @include('stocksSorties.filtreSortie')
    <!-- Tableau des sorties -->
    <div class="card shadow-sm border-0">
        <div class="card-header bg-light d-flex align-items-center">
            <i class="bi bi-clock-history me-2"></i>
            <h5 class="mb-0">Historique des sorties</h5>
        </div>
        <div class="table-responsive" id="stocksSortiesTable">
            <div id="zoneImpression">
                @include('stocksSorties.listeStocksSorties')
            </div>
        </div>
    </div>
</div>
@if (session('show_success_alert_action') && session('show_success_alert_element'))
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const action = @json(session('show_success_alert_action'));
            const element = @json(session('show_success_alert_element'));

            // Appelle ta fonction JS
            showSuccessAlert(action, element);
        });
    </script>
@endif
@include('stocksSorties.modalAttributionLot')
@endsection
