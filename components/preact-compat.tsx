"use client"

import { h, options } from "preact"
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks"

// This file ensures Preact compatibility with Next.js and React components
// It helps prevent the "__H" error by ensuring proper hook initialization

// Export Preact hooks for use in components
export { useEffect, useLayoutEffect, useRef, useState }

// Export h (createElement) from Preact
export { h }

// Set up options for Preact to work better with React components
options.vnode = (vnode) => {
  // Add default props to ensure compatibility
  vnode.props = vnode.props || {}
}

