<!-- resources/views/stocksSorties/create.blade.php -->
<div class="collapse mb-4" id="formCollapse">
    <div class="card border-0 shadow-sm">
        <div class="card-body">
            <h6 class="mb-4">
                <i class="bi bi-receipt me-2"></i> BON SORTIE DE STOCK
            </h6>

            <form id="form-sortie" data-module="form-sortie" action="{{ route('stocksSorties.ajaxStore') }}" method="POST">

                @csrf
                <div class="row g-2 mb-3">
                    <div class="col-md-3">
                        <label class="form-label"><i class="bi bi-calendar-date"></i> Date de sortie</label>
                        <input type="date" name="date_sortie" class="form-control form-control-sm" value="{{ date('Y-m-d') }}" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label"><i class="bi bi-hash"></i> Bon n°</label>
                        <input type="text" name="numero_bon" class="form-control form-control-sm" value="{{ $numeroBon ?? 'BS-'.str_pad(rand(1,9999), 4, '0', STR_PAD_LEFT) }}" readonly>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label"><i class="bi bi-person"></i> Client / Destination</label>
                        <input type="text" name="client" class="form-control form-control-sm" placeholder="Nom du client ou service">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label"><i class="bi bi-hash"></i> N° d’ordre de sortie</label>
                        <input type="text" name="numero_ordre" class="form-control form-control-sm" placeholder="Ex: ORD-0001" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label"><i class="bi bi-pencil-square"></i> Statut</label>
                        <select name="statut" class="form-select form-select-sm">
                            <option value="Brouillon">Brouillon</option>
                            <option value="Validé">Validé</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label"><i class="bi bi-chat-left-text"></i> Motif</label>
                        <input type="text" name="motif" class="form-control form-control-sm" placeholder="Ex: rupture, expiration...">
                    </div>
                </div>

                <div class="mt-3">
                    <h6><i class="bi bi-cart-check me-2"></i> Produits à sortir</h6>
                    @include('stocksSorties.tableAjoutSortie')
                    <button type="button" id="add-row" class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-plus-circle"></i> Ajouter produit
                    </button>
                </div>

                <input type="hidden" name="produits-json" value="">
                
                <div class="text-end mt-4">
                    <button type="button" id="btn-enregistrer" class="btn btn-success btn-sm me-2">
                        <i class="bi bi-save"></i>  <span>Enregistrer en tant que brouillon</span>
                    </button>
                    <button type="button" id="btn-valider" class="btn btn-primary btn-sm">
                        <i class="bi bi-check2-circle"></i> Valider sortie
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
