import {
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Switch,
	Box,
	RadioGroup,
	Radio,
	Stack,
	Checkbox,
} from '@chakra-ui/react'

import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { UiSlider } from '../../../components/ui/slider'
import { UiRangeSlider } from '../../../components/ui/range-slider'
import { outputFormatTextAreaFormat } from '../../components/utils'

export const NameInput = () => {
	const { register } = useFormContext()

	return (
		<FormControl>
			<FormLabel>Название</FormLabel>
			<Input {...register('name')} />
		</FormControl>
	)
}

export const ValueInput: React.FC<{ name?: string }> = ({
	name = 'values',
}) => {
	const { register, control } = useFormContext()

	return (
		<Box>
			<FormControl display={'flex'} alignItems={'center'} gap={4} mb="2">
				<FormLabel m="0" htmlFor="values-type-id" size={'sm'}>
					Тип значения
				</FormLabel>
				<Controller
					name={`${name}.type`}
					control={control}
					render={({ field }) => (
						<RadioGroup onChange={e => field.onChange(e)} value={field.value}>
							<Stack direction="row">
								<Radio value="default">default</Radio>
								<Radio value="weight">weight</Radio>
							</Stack>
						</RadioGroup>
					)}
				/>
			</FormControl>
			<FormControl>
				<FormLabel>Значения</FormLabel>
				<Textarea h={'400px'} {...register(`${name}.data`)} />
			</FormControl>
		</Box>
	)
}
export const OptionalChanceInput = () => {
	const { register, control } = useFormContext()

	return (
		<FormControl>
			<FormLabel>
				Случайный параметр (шанс с которым парметр попадет в генерацию)
			</FormLabel>
			<Checkbox size="lg" {...register('optional.isOptional')} sx={{ mb: 8 }}>
				Включить
			</Checkbox>
			<Controller
				name="optional.value"
				control={control}
				render={({ field }) => (
					<UiSlider
						max={1}
						min={0}
						step={0.01}
						defaultValue={field.value ?? 0.5}
						value={field.value}
						onChange={field.onChange}
					/>
				)}
			/>
		</FormControl>
	)
}
export const RangeInput = () => {
	const { register, control } = useFormContext()
	const [type, value] = useWatch({ name: ['values.type', 'values.data'] })
	const formattedValue = outputFormatTextAreaFormat(
		typeof value !== 'string' ? '' : value,
		type
	)

	console.log('formattedValue', formattedValue)
	return (
		<FormControl>
			<FormLabel>Выбрать несколько случайных значений (от и до)</FormLabel>
			<Checkbox size="lg" {...register('range.isRange')} sx={{ mb: 8 }}>
				Включить
			</Checkbox>
			<Controller
				name="range.value"
				control={control}
				render={({ field }) => {
					return (
						<UiRangeSlider
							min={1}
							max={
								type === 'default'
									? formattedValue?.length
									: Object.keys(formattedValue).length
							}
							step={1}
							value={field.value || [1, 2]}
							defaultValue={field.value || [1, 2]}
							onChange={field.onChange}
						/>
					)
				}}
			/>
		</FormControl>
	)
}