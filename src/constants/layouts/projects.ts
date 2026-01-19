import { Layout } from "../../types/layout"

export const project_list =
`
[Agentic Architecture](0)
[CPP Basics](1)
`

export const agentic_architecture = 
`
# Agentic Architecture
`

export const cpp_basics = 
`
# CPP Basics
`

export const layout: Layout = {
    columns: [
        {
            size: 25,
            content: project_list
        },
        {
            size: 75,
            content: [
                agentic_architecture,
                cpp_basics
            ]
        }
    ]
}
