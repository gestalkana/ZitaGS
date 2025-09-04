<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    /**
     * Afficher la liste des catégories.
     */
    public function index()
    {
        // Récupère toutes les catégories avec le nombre de produits associés
        $categories = Categorie::withCount('produits')->latest()->get();
        

        return view('produits.categories.index', compact('categories'));
    }

    public function show(Categorie $categorie)
    {
        // Optionnel : tu peux rediriger ou retourner une vue
        return redirect()->route('categories.index');
    }


    /**
     * Afficher le formulaire de création d'une nouvelle catégorie.
     */
    public function create()
    {
        return view('categories.create');
    }

    /**
     * Enregistrer une nouvelle catégorie.
     */
    public function store(Request $request)
    {
    // Valide les données
    $validated = $request->validate([
        'reference' => 'required|string',
        'nom' => 'required|string',
        'description' => 'nullable|string',
    ]);

    // Vérifie d'abord si la catégorie existe déjà (sur la référence)
    if (Categorie::where('reference', $validated['reference'])->exists()) {
        return response()->json([
            'success' => false,
            'message' => 'Cette catégorie existe déjà.'
        ], 200);
    }

    // Si pas existante, on crée
    $categorie = Categorie::create($validated);

    // Retour JSON uniquement si requête AJAX
    if ($request->ajax()) {
        return response()->json([
            'success' => true,
            'category' => $categorie->loadCount('produits')
        ]);
    }

    // Sinon redirection classique (si nécessaire)
    return redirect()->route('categories.index')
                     ->with('success', 'Catégorie créée avec succès.');
    }

    /**
     * Afficher le formulaire d'édition.
     */
    public function edit(Categorie $categorie)
    {
        return view('categories.edit', compact('categorie'));
    }

    /**
     * Mettre à jour une catégorie.
     */
    public function update(Request $request, $id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->reference = $request->input('reference');
        $categorie->nom = $request->input('nom');
        $categorie->description = $request->input('description');
        $categorie->save();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Catégorie mise à jour',
                'categorie' => $categorie  // Utile si tu veux mettre à jour une seule ligne du tableau
            ]);

        }

        // Fallback si pas AJAX
        // return redirect()->back()->with('success', 'Catégorie mise à jour');
        return redirect()->route('produits.index', ['onglet' => 'categories'])->with('success', 'Catégorie mise à jour');
    }

    public function reloadCategoriesFragment()
    {
        //$categories = Categorie::all();
        $categories = Categorie::withCount('produits')->latest()->get();
        return view('produits.categories.index', compact('categories'));
    }


    /**
     * Supprimer une catégorie.
     */
    public function destroy($id)
    {
        try {
            $categorie = Categorie::findOrFail($id);
            \Log::info('Suppression de la catégorie ' . $categorie->id);

            $categorie->delete();

            return response()->json([
                'success' => true, 
                'message' => 'Catégorie supprimée.'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie introuvable.'
            ], 404); // réponse claire, pas une erreur serveur

        } catch (\Exception $e) {
            \Log::error('Erreur suppression : ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur interne lors de la suppression.'
            ], 500);
        }
    }


}
