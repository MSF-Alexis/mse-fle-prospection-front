export interface StatutOption {
  value: string;
  label: string;
  badgeClass: string;
}

export const STATUT_OPTIONS: StatutOption[] = [
  { value: 'a_contacter', label: 'À contacter', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
  { value: 'en_cours', label: 'En cours', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'relance', label: 'Relance', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'gagne', label: 'Gagné', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'perdu', label: 'Perdu', badgeClass: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'sans_suite', label: 'Sans suite', badgeClass: 'bg-gray-100 text-gray-500 border-gray-200' },
];

export function getStatutOption(value?: string): StatutOption {
  return (
    STATUT_OPTIONS.find((option) => option.value === value) ?? {
      value: value ?? 'a_contacter',
      label: value ?? 'À contacter',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    }
  );
}
