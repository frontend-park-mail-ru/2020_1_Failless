export default class Router {

    constructor(rootPath, rootElement) {
      this.rootElement = rootElement;
      this.routes = {};
      this.currentController = undefined;
    }
  
    addRoute(url, controller) {
      this.routes[url] = controller;
      return this;
    }
  
    open(url) {
        if (url.startsWith('/') && url.length > 1) {
            url = url.slice(1);
        }

        let newController = this.routes[url];

        newController.action();
        this.currentController = newController;
    }
  
    start() {
        window.addEventListener('popstate', () => {
            const currentPath = window.location.pathname;
            this.open(currentPath);
        });

        const currentPath = window.location.pathname;
        this.open(currentPath);
    }
  }