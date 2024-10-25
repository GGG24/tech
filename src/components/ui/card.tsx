import React from 'react'

export const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>
)

export const CardHeader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="p-4 border-b">{children}</div>
)

export const CardTitle: React.FC<React.PropsWithChildren<{ className?: string; onClick?: () => void }>> = ({ children, className, onClick }) => (
  <h2 className={`text-lg font-semibold ${className}`} onClick={onClick}>{children}</h2>
)

export const CardDescription: React.FC<React.PropsWithChildren> = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
)

export const CardContent: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="p-4">{children}</div>
)
