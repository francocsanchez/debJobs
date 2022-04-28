document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    if (skills) { skills.addEventListener('click', agregarSkills); }

    skillsSeleccionadas();
})

const skills = new Set();
const agregarSkills = e => {
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) {
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo')
        } else {
            skills.add(e.target.textContent);
            e.target.classList.add('activo')
        }
    }
    const arraySkill = [...skills];
    document.querySelector('#skills').value = arraySkill;
}

const skillsSeleccionadas = () => {
    const selectionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));

    selectionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    })

    const arraySkill = [...skills];
    document.querySelector('#skills').value = arraySkill;
}