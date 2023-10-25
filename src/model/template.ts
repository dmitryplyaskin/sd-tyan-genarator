import { createEvent, createStore } from 'effector'
import { PageType, TemplateType } from '../generator/graph-editor/model/types'
import persist from 'effector-localstorage'

const defaultTemplate: TemplateType = {
	id: new Date().getTime(),
	name: 'default template',
	nodes: [],
	edges: [],
	pages: [],
	functions: [],
	globalVariables: [],
}

export const $template = createStore<TemplateType>(defaultTemplate)
export const loadTemplate = createEvent<TemplateType>()
export const initTemplate = createEvent()
export const clearTemplate = createEvent()
export const updatePages = createEvent<PageType[]>()

$template
	.on(loadTemplate, (_, template) => template)
	.on(clearTemplate, () => {})
	.on(updatePages, (state, pages) => ({ ...state, pages }))

persist({ store: $template, key: 'template' })

setTimeout(() => {
	initTemplate()
}, 200)