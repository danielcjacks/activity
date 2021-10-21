import { add_query_ownership_clauses, OwnershipPaths } from './query_ownership'


const ownership_paths: OwnershipPaths = {
    User: [],
    users: [],
    user: [],
    Motivator: ['user'],
    motivators: ['user'],
    motivator: null,
    Behaviour: ['user'],
    behaviours: ['user'],
    behaviour: null,
    BehaviourEvent: ['behaviour', 'user'],
    behaviourEvents: ['behaviour', 'user'],
    behaviourEvent: null,
    Subscription: ['user'],
    subscriptions: ['user'],
    subscription: null,
    BehaviourMotivator: ['behaviour', 'user'],
    behaviourMotivator: null,
    behaviour_motivator: ['behaviour', 'user'],
    behaviour_motivators: ['behaviour', 'user']
}

// theres a separate lookup for root tables to try to hack aroung prisma's inconsistent syntax
const root_ownership_paths: OwnershipPaths = {
    user: [],
    motivator: ['user'],
    behaviour: ['user'],
    behaviourEvent: ['behaviour', 'user'],
    subscription: ['user'],
    behaviourMotivator: ['behaviour', 'user'],
}

export const get_prisma_query = (prisma_query: any, root_table: string, username: string) => {
    return add_query_ownership_clauses(root_table, ownership_paths, root_ownership_paths, 'username', [username], prisma_query)
}