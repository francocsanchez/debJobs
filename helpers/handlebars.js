module.exports = {
    selectSkill: (selections = [], options) => {


        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery',
            'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL',
            'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose',
            'SQL', 'MVC', 'SASS', 'WordPress'];

        let html = '';
        skills.forEach(skill => {
            html += `
            <li ${selections.includes(skill) ? ' class="activo"' : ''}>${skill}</li>`;
        });

        return options.fn().html = html;
    },
    tipoContrato: (selections, options) => {
        return options.fn(this).replace(
            new RegExp(` value="${selections}"`), '$& selected="selected"'
        )
    }
}