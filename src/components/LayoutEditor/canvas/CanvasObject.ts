import { fabric } from 'fabric';

import {
    Element,
    Video,
    Node,
    Link,
    CurvedLink,
    OrthogonalLink,
} from './objects';
import { FabricObject } from './utils';
import { Code } from './objects/Element';
import Svg, { SvgOption } from './objects/Svg';

export interface ObjectSchema {
    create: (...option: any) => fabric.Object;
}

export interface CanvasObjectSchema {
    [key: string]: ObjectSchema;
}

export const createCanvasObject = (objectSchema: CanvasObjectSchema) => objectSchema;

const CanvasObject: CanvasObjectSchema = {
    group: {
        create: ({ objects, ...option }: { objects: FabricObject[] }) => new fabric.Group(objects, option),
    },
    'i-text': {
        create: ({ text, ...option }: { text: string }) => new fabric.IText(text, option),
    },
    textbox: {
        create: ({ text, ...option }: { text: string }) => new fabric.Textbox(text, option),
    },
    image: {
        create: ({ element = new Image(), ...option }) =>
            new fabric.Image(element, {
                ...option,
                crossOrigin: 'anonymous',
            }),
    },
    element: {
        create: ({ code, ...option }: { code: Code }) => new Element(code, option),
    },
    video: {
        create: ({ src, file, ...option }: { src: string; file: File }) => new Video(src || file, option),
    },
    node: {
        create: (option: any) => new Node(option),
    },
	triangle: {
		create: (option: any) => new fabric.Triangle(option),
	},
	circle: {
		create: (option: any) => new fabric.Circle(option),
	},
	rect: {
		create: (option: any) => new fabric.Rect(option),
	},
    link: {
        create: (fromNode, fromPort, toNode, toPort, option) => new Link(fromNode, fromPort, toNode, toPort, option),
    },
    curvedLink: {
        create: (fromNode, fromPort, toNode, toPort, option) =>
            new CurvedLink(fromNode, fromPort, toNode, toPort, option),
    },
    orthogonalLink: {
        create: (fromNode, fromPort, toNode, toPort, option) =>
            new OrthogonalLink(fromNode, fromPort, toNode, toPort, option),
    },
    svg: {
        create: (option: SvgOption) => new Svg(option),
    },
};

export default CanvasObject;
