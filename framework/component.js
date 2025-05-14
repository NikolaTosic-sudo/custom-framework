export function component(name, options) {
  const app = document.getElementById('app');
  
  if (options.render) {
    const element = options.render({ name: name });
    console.log(options.render, element, 'test');
    app.appendChild(element);
  }
}