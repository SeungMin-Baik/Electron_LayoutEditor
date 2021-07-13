import Handler from './Handler';

class AlignmentHandler {
    handler: Handler;
    constructor(handler: Handler) {
        this.handler = handler;
    }

    /**
     * Align left at selection
     */
    public left = () => {
        const activeObject = this.handler.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'activeSelection') {
            const activeSelection = activeObject as fabric.ActiveSelection;
            const activeObjectLeft = -(activeObject.width / 2);
            activeSelection.forEachObject(obj => {
                obj.set({
                    left: activeObjectLeft,
                });
                obj.setCoords();
                this.handler.canvas.renderAll();
            });
        }
    }

    /**
     * Align center at selection
     */
    public center = () => {
        const activeObject = this.handler.canvas.getActiveObject();
        console.log(activeObject);
        if (activeObject && activeObject.type === 'activeSelection') {
            const activeSelection = activeObject as fabric.ActiveSelection;
            activeSelection.forEachObject(obj => {
                obj.set({
                    left: 0 - ((obj.width * obj.scaleX) / 2),
                });
                obj.setCoords();
                this.handler.canvas.renderAll();
            });
        }
    }

    /**
     * Align right at selection
     */
    public right = () => {
        const activeObject = this.handler.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'activeSelection') {
            const activeSelection = activeObject as fabric.ActiveSelection;
            const activeObjectLeft = (activeObject.width / 2);
            activeSelection.forEachObject(obj => {
                obj.set({
                    left: activeObjectLeft - (obj.width * obj.scaleX),
                });
                obj.setCoords();
                this.handler.canvas.renderAll();
            });
        }
    }

    public bold = () => {
        const activeObject = this.handler.canvas.getActiveObject();
        if (activeObject['fontWeight'] === 'bold') {
            activeObject['fontWeight'] = '';
        } else {
            activeObject['fontWeight'] = 'bold';
        }
        activeObject.set({dirty: true});
        this.handler.canvas.renderAll();
    }

    public italic = () => {
        const activeObject = this.handler.canvas.getActiveObject();
        if (activeObject['fontStyle'] === 'italic') {
            activeObject['fontStyle'] = '';
        } else {
            activeObject['fontStyle'] = 'italic';
        }
        activeObject.set({dirty: true});
        this.handler.canvas.renderAll();
    }

    public underLine = () => {
        const activeObject = this.handler.canvas.getActiveObject();
        if (activeObject['underline'] === true) {
            activeObject['underline'] = false;
        } else {
            activeObject['underline'] = true;
        }
        activeObject.set({dirty: true});
        this.handler.canvas.renderAll();
    }

    public strikethrough = () => {
        const activeObject = this.handler.canvas.getActiveObject();
        if (activeObject['linethrough'] === true) {
            activeObject['linethrough'] = false;
        } else {
            activeObject['linethrough'] = true;
        }
        activeObject.set({dirty: true});
        this.handler.canvas.renderAll();
    }

    public changeColor = (color) => {
        const activeObject = this.handler.canvas.getActiveObject();
        activeObject.fill = color;
        activeObject.set({dirty: true});
        this.handler.canvas.renderAll();
    }

    public frameLineWeight = (value) => {
        const activeObject = this.handler.canvas.getActiveObject();
        activeObject.strokeWidth = value;
        activeObject.set({dirty: true});
        this.handler.canvas.renderAll();
    }

    public frameLineStyle = (value) => {
        let tmpValue = [];

        if (value === 'solid') {
            tmpValue = [0, 0];
        } else if (value === 'dotted') {
            tmpValue = [5, 5];
        } else if (value === 'dashed') {
            tmpValue = [10, 5];
        }
        const activeObject = this.handler.canvas.getActiveObject();
        activeObject.strokeDashArray = tmpValue;
        activeObject.set({dirty: true});
        this.handler.canvas.renderAll();
    }

    public frameBorderColor = (color) => {
        const activeObject = this.handler.canvas.getActiveObject();
        activeObject.stroke = color;
        activeObject.set({dirty: true});
        this.handler.canvas.renderAll();
    }

    public frameFillColor = (color) => {
        const activeObject = this.handler.canvas.getActiveObject();
        activeObject.fill = color;
        activeObject.set({dirty: true});
        this.handler.canvas.renderAll();
    }


}

export default AlignmentHandler;
