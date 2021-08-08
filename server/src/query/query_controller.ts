import { add_query_ownership_clauses, OwnershipPaths } from './query_ownership'


const ownership_paths: OwnershipPaths = {
    User: [],
    users: [],
    user: [],
    Value: ['User'],
    values: ['User'],
    value: ['User'],
    Goal: ['User'],
    goals: ['User'],
    goal: ['User'],
    Behaviour: ['Goal', 'User'],
    behaviours: ['Goal', 'User'],
    behaviour: ['Goal', 'User'],
    BehaviourEvent: ['Behaviour', 'Goal', 'User'],
    behaviourEvents: ['Behaviour', 'Goal', 'User'],
    behaviourEvent: ['Behaviour', 'Goal', 'User'],
}

export const get_prisma_query = (prisma_query: any, root_table: string, username: string) => {
    return add_query_ownership_clauses(root_table, ownership_paths, 'username', [username], prisma_query)
}