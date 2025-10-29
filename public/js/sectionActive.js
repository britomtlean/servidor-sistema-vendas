const sectionActive = (active) => {
    document.querySelectorAll('section').forEach(array => array.classList.remove('active'));
    document.getElementById(active).classList.add('active');
}

sectionActive('pedidos')