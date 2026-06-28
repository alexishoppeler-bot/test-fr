# Explication — Pourcentages par niveau CECRL

## Principe

Le test contient **30 questions**, chacune assignée à un niveau CECRL précis.
Pour chaque groupe de questions, on calcule le **taux de bonnes réponses**.

```
% niveau X = (bonnes réponses aux questions de niveau X) / (total questions de niveau X) × 100
```

---

## Répartition des questions par niveau

| Niveau | Questions      | Nombre |
|--------|---------------|--------|
| Pré-A1 | Q01, Q02      | 2      |
| A1     | Q03–Q06       | 4      |
| A2     | Q07–Q12       | 6      |
| B1     | Q13–Q18       | 6      |
| B2     | Q19–Q22       | 4      |
| C1     | Q23–Q30       | 8      |
| **Total** |            | **30** |

---

## Exemple concret

Un candidat de niveau **B1** répond typiquement comme ça :

| Niveau | Bonnes / Total | % affiché | Interprétation |
|--------|---------------|-----------|----------------|
| Pré-A1 | 2/2           | **100%**  | Maîtrisé       |
| A1     | 4/4           | **100%**  | Maîtrisé       |
| A2     | 5/6           | **83%**   | Bien maîtrisé  |
| B1     | 3/6           | **50%**   | Niveau atteint |
| B2     | 1/4           | **25%**   | En cours       |
| C1     | 0/8           | **0%**    | Non atteint    |

> Un vrai profil B1 montre des scores **décroissants** : élevés sur les niveaux inférieurs, bas sur les supérieurs.

---

## Pourquoi 0% sur tous les premiers niveaux lors d'un test rapide ?

Quand on passe le test en cliquant "Suivant" sans répondre :
- Réponse enregistrée = `""` (vide)
- `"" === "êtes"` → **faux** → 0 point

Résultat : tous les niveaux affichent 0% sauf si on a cliqué par hasard sur une bonne réponse.

---

## Calcul dans le code

```javascript
// data.js — attribution des questions aux niveaux
const PAR_NIVEAU = {
  "Pré-A1": ["Q01","Q02"],
  "A1":     ["Q03","Q04","Q05","Q06"],
  "A2":     ["Q07","Q08","Q09","Q10","Q11","Q12"],
  "B1":     ["Q13","Q14","Q15","Q16","Q17","Q18"],
  "B2":     ["Q19","Q20","Q21","Q22"],
  "C1":     ["Q23","Q24","Q25","Q26","Q27","Q28","Q29","Q30"]
};

// quiz.js — calcul du score par niveau
const nivScores = {};
Object.entries(PAR_NIVEAU).forEach(([niveau, ids]) => {
  const questions = repDetail.filter(r => ids.includes(r.question_id));
  const bonnes    = questions.filter(r => r.correct).length;
  nivScores[niveau] = questions.length
    ? Math.round(bonnes / questions.length * 100)
    : 0;
});
```

---

## Niveau final (badge)

Le niveau final **n'est pas** le niveau avec le meilleur score.
Il est calculé sur le **score global** (total de bonnes réponses / 30) :

| Score total | Niveau final |
|-------------|-------------|
| 0–6 / 30    | Pré-A1      |
| 7–12 / 30   | A1          |
| 13–18 / 30  | A2          |
| 19–22 / 30  | B1          |
| 23–27 / 30  | B2          |
| 28–30 / 30  | C1          |

---

## Ce qui est envoyé dans l'email

| Variable EmailJS  | Valeur                                |
|-------------------|---------------------------------------|
| `{{niv_prea1}}`  | % bonnes réponses sur Q01–Q02         |
| `{{niv_a1}}`     | % bonnes réponses sur Q03–Q06         |
| `{{niv_a2}}`     | % bonnes réponses sur Q07–Q12         |
| `{{niv_b1}}`     | % bonnes réponses sur Q13–Q18         |
| `{{niv_b2}}`     | % bonnes réponses sur Q19–Q22         |
| `{{niv_c1}}`     | % bonnes réponses sur Q23–Q30         |
| `{{niveau}}`     | Niveau final (badge) calculé globalement |
| `{{score}}`      | Score global en %                     |
| `{{bonnes}}`     | Nombre de bonnes réponses (sur 30)    |
