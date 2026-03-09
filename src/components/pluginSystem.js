export class PluginManager {
    plugins = [];
    context;
    constructor(plugins = [], context) {
        this.plugins = plugins;
        this.context = context;
    }
    setContext(context) {
        this.context = context;
    }
    init() {
        this.plugins.forEach((p) => {
            if (p.init)
                p.init(this.context);
        });
    }
    triggerBeforeRender() {
        this.plugins.forEach((p) => {
            if (p.hooks?.beforeRender)
                p.hooks.beforeRender(this.context);
        });
    }
    triggerOnEventRender(event, element) {
        this.plugins.forEach((p) => {
            if (p.hooks?.onEventRender)
                p.hooks.onEventRender(event, element);
        });
    }
    triggerOnEventClick(event) {
        this.plugins.forEach((p) => {
            if (p.hooks?.onEventClick)
                p.hooks.onEventClick(event);
        });
    }
    triggerAfterRender() {
        this.plugins.forEach((p) => {
            if (p.hooks?.afterRender)
                p.hooks.afterRender(this.context);
        });
    }
    triggerValidateSave(event) {
        const errors = [];
        this.plugins.forEach((p) => {
            if (p.hooks?.validateSave) {
                const error = p.hooks.validateSave(event, this.context);
                if (error)
                    errors.push(error);
            }
        });
        return errors;
    }
}
