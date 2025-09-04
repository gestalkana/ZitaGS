(function () {
    let currentIndex = 1;
    let selectedProduitId = null;
    let selectedQuantiteDemandee = null;

    document.addEventListener('DOMContentLoaded', function () {
        const addRowBtn = document.getElementById('add-row');
        const confirmLotsBtn = document.getElementById('confirm-lots');
        const form = document.getElementById('form-sortie');

        if (addRowBtn) addRowBtn.addEventListener('click', handleAddRow);
        if (confirmLotsBtn) confirmLotsBtn.addEventListener('click', handleConfirmLots);
        if (form) form.addEventListener('submit', handleSubmit);

        document.addEventListener('click', handleDocumentClick);
    });

    function handleAddRow() {
        const tbody = document.getElementById('produits-sortie-body');
        const selectBase = document.querySelector('select[name="produits[0][produit_id]"]');

        if (!tbody || !selectBase) return;

        const selectHTML = selectBase.innerHTML;
        const index = currentIndex++;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <select name="produits[${index}][produit_id]" class="form-select form-select-sm produit-select" data-index="${index}" required>
                    ${selectHTML}
                </select>
            </td>
            <td>
                <input type="number" name="produits[${index}][quantite]" class="form-control form-control-sm quantite-input" data-index="${index}" min="1" required>
            </td>
            <td>
                <input type="text" class="form-control form-control-sm unite-input" data-index="${index}" readonly>
            </td>
            <td class="text-center">
                <span class="stock-disponible text-muted">--</span>
            </td>
            <td class="d-flex justify-content-between align-items-center">
                <button type="button" class="btn btn-outline-secondary btn-sm attribuer-lots" data-index="${index}">
                    <i class="bi bi-tools"></i> Choisir lots
                </button>
                <div class="ms-2 mt-1 small text-primary lots-affiches" data-index="${index}">Aucun lot attribué</div>
                <div class="lots-hidden" data-index="${index}"></div>
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-outline-danger btn-sm remove-row">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
        // Attribution automatique de l'unité de mesure
        // un écouteur de changement pour mettre à jour l’unité de mesure
        const produitSelect = row.querySelector('.produit-select');
        const uniteInput = row.querySelector('.unite-input');

        produitSelect.addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            const unite = selectedOption.dataset.unite || 'Non défini';
            uniteInput.value = unite;
        });
         // Appel API pour récupérer le stock disponible
        fetch(`/produits/${produitId}/stock-disponible`)
            .then(res => res.json())
            .then(data => {
                const stockDisponible = data.stock_disponible ?? 0;
                stockCell.textContent = stockDisponible;

                // Met à jour aussi data-stock sur l'option sélectionnée (utile pour validation)
                selectedOption.dataset.stock = stockDisponible;
            })
            .catch(err => {
                console.error('Erreur récupération stock :', err);
                stockCell.textContent = 'Erreur';
            });
    }

    function handleDocumentClick(e) {
        if (e.target.closest('.remove-row')) {
            e.target.closest('tr').remove();
            return;
        }

        if (e.target.closest('.attribuer-lots')) {
            handleChoisirLots(e.target.closest('.attribuer-lots'));
        }
    }

    function handleChoisirLots(button) {
        const index = button.dataset.index;
        const row = button.closest('tr');

        const produitInput = row.querySelector('select');
        const quantiteInput = row.querySelector('input[type="number"]');

        selectedProduitId = produitInput.value.trim();
        selectedQuantiteDemandee = parseInt(quantiteInput.value) || 0;

        if (!selectedProduitId || selectedQuantiteDemandee <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: "Veuillez sélectionner un produit et une quantité valide."
            });
            return;
        }

        //  Ajout de la vérification du stock disponible
       fetch(`/produits/${selectedProduitId}/stock-disponible`)
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la récupération du stock disponible.");
                return res.json();
            })
            .then(stockData => {
                const disponible = parseInt(stockData.stock_disponible) || 0;

                if (selectedQuantiteDemandee > disponible) {
                   Swal.fire({
                        icon: 'warning',
                        title: 'Stock insuffisant ',
                        html: `
                            La quantité demandée <strong style="color:#d33;">${selectedQuantiteDemandee}</strong> unités,<br>
                            est supérieure au stock disponible <strong style="color:#3085d6;">${disponible}</strong> unités.<br><br>
                            Veuillez réduire la quantité ou vérifier le stock.
                        `,
                        confirmButtonText: 'OK, compris'
                    });
                    return;
                }

                // Si stock OK, continuer normalement
                document.getElementById('confirm-lots').dataset.current = index;

                fetch(`/api/lots-disponibles/${selectedProduitId}`)
                    .then(res => {
                        if (!res.ok) throw new Error("Erreur de chargement des lots.");
                        return res.json();
                    })
                    .then(data => afficherLotsDansModal(data))
                    .catch(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur',
                            text: error.message
                        });
                    });

            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: error.message
                });
            });
    }

    function afficherLotsDansModal(data) {
        const tbody = document.getElementById('lot-modal-body');
        tbody.innerHTML = '';

        if (data.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Aucun lot',
                text: 'Aucun lot disponible pour ce produit.'
            });
            return;
        }

        data.forEach(lot => {
            const max = Math.min(lot.reste, selectedQuantiteDemandee);
            tbody.innerHTML += `
                <tr>
                    <td>${lot.produit}</td>
                    <td>${lot.numero_lot}</td>
                    <td>${lot.date_entree}</td>
                    <td>${lot.date_expiration || 'non défini'}</td>
                    <td>${lot.reste}</td>
                    <td>
                        <input type="number" class="form-control form-control-sm qte-lot" data-lot-id="${lot.id}" max="${max}" min="1" title="Maximum autorisé: ${max}" placeholder="0">
                    </td>
                </tr>
            `;
        });

        new bootstrap.Modal(document.getElementById('lotModal')).show();
    }

    function handleConfirmLots() {
        const index = this.dataset.current;
        const container = document.querySelector(`.lots-hidden[data-index="${index}"]`);
        const display = document.querySelector(`.lots-affiches[data-index="${index}"]`);
        const rows = document.querySelectorAll('#lot-modal-body tr');

        if (!container || !display) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: `Aucun container/display trouvé pour l’index ${index}`
            });
            return;
        }

        container.innerHTML = '';
        display.innerHTML = '';

        let total = 0;
        let erreur = false;

        rows.forEach(row => {
            const input = row.querySelector('input.qte-lot');
            const val = parseInt(input.value);

            if (val > 0) {
                const lotId = input.dataset.lotId;
                const max = parseInt(input.getAttribute('max'));

                if (val > max) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: `La quantité pour le lot ${lotId} dépasse ${max}`
                    });
                    input.focus();
                    erreur = true;
                    return;
                }

                total += val;

                const hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = `produits[${index}][lots][]`;
                hidden.value = `${lotId}:${val}`;
                container.appendChild(hidden);

                const info = document.createElement('div');
                info.className = 'text-success';
                info.textContent = `Lot ${lotId} : ${val} unités`;
                display.appendChild(info);
            }
        });

        if (erreur) return;

        if (total > selectedQuantiteDemandee) {
            Swal.fire({
                icon: 'error',
                title: 'Trop de quantité',
                text: `Total : ${total} > demandé : ${selectedQuantiteDemandee}`
            });
            container.innerHTML = '';
            display.innerHTML = '<div class="text-danger">Erreur de dépassement</div>';
            return;
        }

        if (total === 0) {
            display.innerHTML = '<div class="text-warning">Aucun lot sélectionné</div>';
        } else {
            display.innerHTML += `<div class="text-success fw-bold">Total : ${total} unités</div>`;
        }

        bootstrap.Modal.getInstance(document.getElementById('lotModal')).hide();
    }

   
   function handleSubmit(e) {
    e.preventDefault(); // Empêche la soumission par défaut

    const form = e.target;

    const lignesProduits = form.querySelectorAll('tr');
    let erreur = false;

    lignesProduits.forEach(row => {
        const quantiteInput = row.querySelector('input.quantite-input');
        const displayLots = row.querySelector('.lots-affiches');
        const hiddenLots = row.querySelector('.lots-hidden');

        if (!quantiteInput || !displayLots || !hiddenLots) return;

        const quantiteDemandee = parseInt(quantiteInput.value) || 0;
        const inputsHidden = hiddenLots.querySelectorAll('input[type="hidden"]');

        let totalAttribue = 0;
        inputsHidden.forEach(input => {
            const [lotId, quantite] = input.value.split(':');
            totalAttribue += parseInt(quantite) || 0;
        });

        if (quantiteDemandee === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Quantité manquante',
                text: 'Une ou plusieurs lignes ont une quantité demandée de 0.'
            });
            erreur = true;
            return;
        }

        if (inputsHidden.length === 0 || totalAttribue === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Lots manquants',
                text: 'Tous les produits doivent avoir des lots attribués.'
            });
            erreur = true;
            return;
        }

        if (totalAttribue !== quantiteDemandee) {
            Swal.fire({
                icon: 'error',
                title: 'Quantité incorrecte',
                html: `La somme des quantités des lots (<strong>${totalAttribue}</strong>) ne correspond pas à la quantité demandée (<strong>${quantiteDemandee}</strong>).`
            });
            erreur = true;
            return;
        }
    });

    if (erreur) return;

    // Soumission seulement si tout est OK
    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
    })
    .then(async response => {
        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Réponse invalide du serveur");
        }

        if (!response.ok || data.success === false) {
            throw new Error(data.message || "Erreur inconnue.");
        }

        return data;
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: data.message
        }).then(() => {
            window.location.href = "/stocksSorties";
        });
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error.message
        });
    });
}

})();
