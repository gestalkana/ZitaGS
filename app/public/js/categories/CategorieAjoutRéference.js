// document.addEventListener('DOMContentLoaded', function () {
//     const modal = document.getElementById('createCategoryModal');
//     modal.addEventListener('show.bs.modal', function () {
//         fetch("{{ route('categories.nextReference') }}")
//             .then(response => response.json())
//             .then(data => {
//                 document.getElementById('categoryReference').value = data.reference;
//             })
//             .catch(error => {
//                 console.error("Erreur lors de la récupération de la référence :", error);
//                 document.getElementById('categoryReference').value = 'Erreur';
//             });
//     });
// });
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('createCategoryModal');

  modal.addEventListener('show.bs.modal', function () {
    const referenceUrl = modal.dataset.referenceUrl;

    fetch(referenceUrl)
      .then(response => response.json())
      .then(data => {
        document.getElementById('categoryReference').value = data.reference;
      })
      .catch(error => {
        console.error("Erreur lors de la récupération de la référence :", error);
        document.getElementById('categoryReference').value = 'Erreur';
      });
  });
});
