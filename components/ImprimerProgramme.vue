<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">🖨️ Impression Programme</h2>
        <p class="text-gray-500 text-sm mt-1">Générez le bulletin imprimable du culte dominical</p>
      </div>
    </div>

    <!-- Sélection du programme -->
    <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
      <label class="block text-sm font-semibold text-blue-700 mb-2">Sélectionner le programme à imprimer</label>
      <div class="flex flex-col md:flex-row gap-3">
        <select v-model="selectedProgrammeId"
          class="flex-1 px-3 py-2.5 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 outline-none text-sm">
          <option value="">— Choisir un programme —</option>
          <option v-for="p in programmes" :key="p.id" :value="p.id">
            {{ formatDate(p.date) }} — {{ p.theme || 'Sans thème' }} ({{ statusLabel(p.status) }})
          </option>
        </select>
        <button v-if="selectedProgramme" @click="printProgramme"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimer le bulletin
        </button>
      </div>
    </div>

    <!-- Aperçu -->
    <div v-if="selectedProgramme" class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <span class="text-xs font-semibold text-gray-500 uppercase">Aperçu du bulletin</span>
        <button @click="printProgramme" class="text-xs text-blue-600 hover:underline">Imprimer →</button>
      </div>

      <!-- Aperçu du document -->
      <div class="p-6 bg-white max-w-2xl mx-auto" id="bulletin-preview">
        <!-- En-tête -->
        <div class="text-center border-b-2 border-green-600 pb-4 mb-5">
          <h1 class="text-2xl font-bold text-green-700">⛪ CMA DOKUI1</h1>
          <p class="text-sm text-gray-500 mt-1">Communauté Missionnaire et Apostolique</p>
          <div class="flex justify-center gap-8 mt-3 text-sm">
            <span class="font-semibold text-gray-700">📅 {{ formatDateLong(selectedProgramme.date) }}</span>
            <span v-if="selectedProgramme.semaine" class="text-gray-500">{{ selectedProgramme.semaine }}</span>
          </div>
        </div>

        <!-- Thème -->
        <div v-if="selectedProgramme.theme" class="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-center">
          <p class="text-xs text-green-600 font-semibold uppercase mb-1">Thème de la semaine</p>
          <p class="text-lg font-bold text-green-800">{{ selectedProgramme.theme }}</p>
        </div>

        <!-- Cantiques -->
        <div v-if="selectedProgramme.cantiqueFrancais || selectedProgramme.cantiqueBaoule" class="mb-5">
          <h3 class="text-sm font-bold text-gray-700 border-b border-gray-200 pb-1 mb-3">🎵 Cantiques</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div v-if="selectedProgramme.cantiqueFrancais">
              <p class="text-xs text-gray-500 mb-0.5">Français</p>
              <p class="font-medium">{{ selectedProgramme.cantiqueFrancais }}
                <span v-if="selectedProgramme.cantiqueFrancaisRef" class="text-gray-400">({{ selectedProgramme.cantiqueFrancaisRef }})</span>
              </p>
            </div>
            <div v-if="selectedProgramme.cantiqueBaoule">
              <p class="text-xs text-gray-500 mb-0.5">Baoulé</p>
              <p class="font-medium">{{ selectedProgramme.cantiqueBaoule }}
                <span v-if="selectedProgramme.cantiqueBaouleRef" class="text-gray-400">({{ selectedProgramme.cantiqueBaouleRef }})</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Rôles par culte -->
        <div v-for="culte in culteTypes" :key="culte.value" class="mb-4">
          <div v-if="getRolesForCulte(culte.value).length > 0">
            <h3 class="text-sm font-bold text-gray-700 border-b border-gray-200 pb-1 mb-3">{{ culte.label }}</h3>
            <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <div v-for="role in getRolesForCulte(culte.value)" :key="role.id" class="flex justify-between">
                <span class="text-gray-500">{{ roleLabel(role.role) }}</span>
                <span class="font-medium text-gray-800">
                  {{ role.membre ? role.membre.nom + ' ' + role.membre.prenom : '—' }}
                  <span v-if="role.heure" class="text-xs text-gray-400 ml-1">({{ role.heure }})</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="selectedProgramme.notes" class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p class="text-xs font-semibold text-yellow-700 mb-1">📝 Notes</p>
          <p class="text-sm text-gray-700">{{ selectedProgramme.notes }}</p>
        </div>

        <!-- Pied de page -->
        <div class="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>CMA DOKUI1 — Que Dieu soit glorifié dans ce culte 🙏</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-400">
      <span class="text-5xl block mb-3">🖨️</span>
      <p>Sélectionnez un programme pour afficher l'aperçu</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const programmes = ref([])
const selectedProgrammeId = ref('')
const selectedProgramme = computed(() => programmes.value.find(p => p.id === Number(selectedProgrammeId.value)) || null)

const culteTypes = [
  { value: 'PREMIER', label: '🌅 Premier Culte' },
  { value: 'DEUXIEME', label: '☀️ Deuxième Culte' },
  { value: 'TROISIEME', label: '🌙 Troisième Culte' }
]

onMounted(async () => {
  try { programmes.value = await $fetch('/api/programmes') || [] }
  catch (e) { console.error(e) }
})

const getRolesForCulte = (type) => selectedProgramme.value?.roles?.filter(r => r.culteType === type) || []

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const formatDateLong = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '—'

const statusLabel = (s) => ({ PLANIFIE: 'Planifié', EN_COURS: 'En cours', TERMINE: 'Terminé', ANNULE: 'Annulé' }[s] || s)
const roleLabel = (r) => ({ PRESIDENT: 'Président', ANNONCES: 'Annonces', PREDICATEUR: 'Prédicateur', LOUANGE: 'Louange' }[r] || r)

const printProgramme = () => {
  const p = selectedProgramme.value
  if (!p) return

  const getRolesHtml = (type, label) => {
    const roles = getRolesForCulte(type)
    if (!roles.length) return ''
    const rows = roles.map(r => `
      <tr>
        <td style="padding:4px 8px;color:#666;font-size:13px">${roleLabel(r.role)}</td>
        <td style="padding:4px 8px;font-weight:500;font-size:13px">
          ${r.membre ? r.membre.nom + ' ' + r.membre.prenom : '—'}
          ${r.heure ? `<span style="color:#999;font-size:11px;margin-left:4px">(${r.heure})</span>` : ''}
        </td>
      </tr>`).join('')
    return `
      <h3 style="font-size:14px;font-weight:700;color:#374151;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin:16px 0 10px">${label}</h3>
      <table style="width:100%;border-collapse:collapse">${rows}</table>`
  }

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>Programme — ${formatDateLong(p.date)}</title>
<style>
  @page { size: A4; margin: 1.5cm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; max-width: 600px; margin: 0 auto; }
  @media print { body { margin: 0; } }
</style>
</head><body>
  <div style="text-align:center;border-bottom:3px solid #16a34a;padding-bottom:16px;margin-bottom:20px">
    <h1 style="font-size:26px;color:#16a34a;margin:0">⛪ CMA DOKUI1</h1>
    <p style="color:#6b7280;font-size:13px;margin:4px 0">Communauté Missionnaire et Apostolique</p>
    <p style="font-size:15px;font-weight:600;color:#374151;margin:8px 0">📅 ${formatDateLong(p.date)}${p.semaine ? ' — ' + p.semaine : ''}</p>
  </div>

  ${p.theme ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px 16px;text-align:center;margin-bottom:16px">
    <p style="color:#15803d;font-size:11px;font-weight:600;text-transform:uppercase;margin:0 0 4px">Thème de la semaine</p>
    <p style="color:#166534;font-size:17px;font-weight:700;margin:0">${p.theme}</p>
  </div>` : ''}

  ${(p.cantiqueFrancais || p.cantiqueBaoule) ? `<div style="margin-bottom:16px">
    <h3 style="font-size:14px;font-weight:700;color:#374151;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin:0 0 10px">🎵 Cantiques</h3>
    <table style="width:100%;border-collapse:collapse">
      ${p.cantiqueFrancais ? `<tr><td style="padding:3px 8px;color:#666;font-size:13px;width:40%">Français</td><td style="padding:3px 8px;font-weight:500;font-size:13px">${p.cantiqueFrancais}${p.cantiqueFrancaisRef ? ' (' + p.cantiqueFrancaisRef + ')' : ''}</td></tr>` : ''}
      ${p.cantiqueBaoule ? `<tr><td style="padding:3px 8px;color:#666;font-size:13px">Baoulé</td><td style="padding:3px 8px;font-weight:500;font-size:13px">${p.cantiqueBaoule}${p.cantiqueBaouleRef ? ' (' + p.cantiqueBaouleRef + ')' : ''}</td></tr>` : ''}
    </table>
  </div>` : ''}

  ${getRolesHtml('PREMIER', '🌅 Premier Culte')}
  ${getRolesHtml('DEUXIEME', '☀️ Deuxième Culte')}
  ${getRolesHtml('TROISIEME', '🌙 Troisième Culte')}

  ${p.notes ? `<div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;margin-top:16px">
    <p style="font-size:12px;font-weight:600;color:#92400e;margin:0 0 4px">📝 Notes</p>
    <p style="font-size:13px;color:#374151;margin:0">${p.notes}</p>
  </div>` : ''}

  <div style="margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;text-align:center;color:#9ca3af;font-size:11px">
    <p style="margin:0">CMA DOKUI1 — Que Dieu soit glorifié dans ce culte 🙏</p>
    <p style="margin:4px 0 0">Imprimé le ${new Date().toLocaleDateString('fr-FR')}</p>
  </div>
</body></html>`

  const w = window.open('', '_blank')
  if (!w) { alert('Autorisez les pop-ups pour imprimer'); return }
  w.document.write(html)
  w.document.close()
  setTimeout(() => w.print(), 600)
}
</script>
