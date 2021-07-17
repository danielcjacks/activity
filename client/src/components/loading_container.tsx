import { CircularProgress } from '@material-ui/core'
import React, { useLayoutEffect, useRef, useState } from 'react'

export const LoadingContainer = ({ is_loading, children }) => {
    const ref = useRef(null as any)
    const [dimensions, set_dimensions] = useState({} as Record<string, any>)

    useLayoutEffect(() => {
        if (ref.current) {
            const el = ref.current
            const height = el.clientHeight
            const width = el.clientWidth
            set_dimensions({ height, width })
        }
    }, [])

    const loading_size = Math.max(
        Math.min(
            Math.min(dimensions.width, dimensions.height) - 20,
            100
        ),
        10
    )


    if (is_loading && loading_size) {

        const loader =
            <div
                key={'loading-child'}
                style={{ display: 'grid', placeItems: 'center', width: `${dimensions.width}px`, height: `${dimensions.height}px`, padding: 'none', margin: 'none' }}
            >
                <CircularProgress color="secondary" variant='indeterminate' size={loading_size} />
            </div>

        return loader
    } else {
        return <span ref={el => ref.current = el}>
            {children}
        </span>
    }
}