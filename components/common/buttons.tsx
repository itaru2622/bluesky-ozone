import { ComponentProps } from 'react'

export function ButtonPrimary(props: ComponentProps<'button'>) {
  const { className = '', ...others } = props
  return (
    <button
      type="button"
      className={`inline-flex items-center rounded border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${className}`}
      {...others}
    />
  )
}

export function ButtonSecondary(props: ComponentProps<'button'>) {
  const { className = '', ...others } = props
  return (
    <button
      type="button"
      className={`inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-base font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${className}`}
      {...others}
    />
  )
}