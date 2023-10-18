/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useStore } from 'effector-react/effector-react.mjs'
import { $currentEditNode, $editNode, closeEditNode } from './model/edit-node'
import {
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Stack,
} from '@chakra-ui/react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { SimpleNodeForm } from './edit-node-form/simple'
import { BranchNodeForm } from './edit-node-form/branch'
import { TemplateNodeForm } from './edit-node-form/template'
import { changeBranchType, changeSimpleType, changeTemplateType } from './model'
import { outputFormatTextAreaFormat } from '../components/utils'

export const EditNode = () => {
	const { isOpen } = useStore($editNode)
	const currentNode = useStore($currentEditNode)
	const btnRef = React.useRef<any>()
	const methods = useForm()

	// @ts-expect-error
	const handleSubmit = v => {
		if (v.type === 'SimpleNode') {
			// @ts-expect-error
			changeSimpleType({
				...currentNode,
				data: {
					...v,
					values: {
						type: v.values.type,
						data: outputFormatTextAreaFormat(v.values.data, v.values.type),
					},
				},
			})
		}
		if (v.type === 'BranchNode') {
			// @ts-expect-error
			changeBranchType({
				...currentNode,
				data: {
					...v,
					values: {
						type: v.values.type,
						data: outputFormatTextAreaFormat(v.values.data, v.values.type),
					},
				},
			})
		}
		if (v.type === 'TemplateNode') {
			// @ts-expect-error
			changeTemplateType({
				...currentNode,
				data: {
					...v,
					templates: {
						type: v.templates.type,
						data: outputFormatTextAreaFormat(
							v.templates.data,
							v.templates.type
						),
					},
					keys: Object.entries(v.keys).reduce((acc, [key, value]) => {
						return {
							...acc,
							[key]: {
								// @ts-expect-error
								type: value.type,
								// @ts-expect-error
								data: outputFormatTextAreaFormat(value.data, value.type),
							},
						}
					}, {}),
				},
			})
		}

		closeEditNode()
	}

	return (
		<Drawer
			isOpen={isOpen}
			placement="right"
			onClose={closeEditNode}
			finalFocusRef={btnRef}
		>
			<DrawerOverlay />
			<DrawerContent maxW={'700px'}>
				<FormProvider {...methods}>
					<DrawerCloseButton />

					<DrawerHeader>Настройки {currentNode?.data.name}</DrawerHeader>

					<DrawerBody>
						<Stack spacing="4">
							{currentNode && currentNode.type === 'SimpleNode' && (
								<SimpleNodeForm {...currentNode} />
							)}
							{currentNode && currentNode.type === 'BranchNode' && (
								<BranchNodeForm {...currentNode} />
							)}
							{currentNode && currentNode.type === 'TemplateNode' && (
								<TemplateNodeForm {...currentNode} />
							)}
						</Stack>
					</DrawerBody>

					<DrawerFooter>
						<Button variant="outline" mr={3} onClick={() => closeEditNode()}>
							Отменить
						</Button>
						<Button
							colorScheme="blue"
							onClick={methods.handleSubmit(handleSubmit)}
						>
							Сохранить
						</Button>
					</DrawerFooter>
				</FormProvider>
			</DrawerContent>
		</Drawer>
	)
}