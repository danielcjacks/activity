import { expect } from 'chai'
import { describe, test } from 'mocha'
import { add_query_ownership_clauses, OwnershipPaths, is_table_name, combine_wheres, get_ownership_path } from './query_ownership'


describe('query', () => {
    describe(add_query_ownership_clauses.name, () => {
        const ownership_paths: OwnershipPaths = {
            grandparent: [],
            parent: ['grandparent'],
            child: ['parent', 'grandparent']
        }
        test('handles a deeply nested ownership', () => {
            const prisma_query = {
                select: { column1: true }
            }
            const result = add_query_ownership_clauses('child', ownership_paths, ownership_paths, 'id', [1, 2], prisma_query)

            expect(result).to.deep.equal({
                select: { column1: true },
                where: {
                    parent: {
                        is: {
                            grandparent: {
                                is: {
                                    id: {
                                        in: [1, 2]
                                    }
                                }
                            }
                        }
                    }
                }
            })
        })
        test('handles \'true\' nested query', () => {
            const prisma_query = {
                select: {
                    parent: true,
                }
            }

            const result = add_query_ownership_clauses('child', ownership_paths, ownership_paths, 'id', [1, 2], prisma_query)

            expect(result).to.deep.equal({
                select: {
                    parent: {
                        where: {
                            grandparent: {
                                is: {
                                    id: {
                                        in: [1, 2]
                                    }
                                }
                            }
                        }
                    },
                },
                where: {
                    parent: {
                        is: {
                            grandparent: {
                                is: {
                                    id: {
                                        in: [1, 2]
                                    }
                                }
                            }
                        }
                    }
                }
            })
        })
        test('handles object nesting nesting', () => {
            const prisma_query = {
                select: {
                    parent: {},
                }
            }

            const result = add_query_ownership_clauses('child', ownership_paths, ownership_paths, 'id', [1, 2], prisma_query)

            expect(result).to.deep.equal({
                select: {
                    parent: {
                        where: {
                            grandparent: {
                                is: {
                                    id: {
                                        in: [1, 2]
                                    }

                                }
                            }
                        }
                    },
                },
                where: {
                    parent: {
                        is: {
                            grandparent: {
                                is: {
                                    id: {
                                        in: [1, 2]
                                    }
                                }
                            }
                        }
                    }
                }
            })
        })
        test('skips child nesting on root', () => {
            const prisma_query = {
                select: {
                    parent: {},
                }
            }

            const result = add_query_ownership_clauses('grandparent', ownership_paths, ownership_paths, 'id', [1, 2], prisma_query)

            expect(result).to.deep.equal({
                select: {
                    parent: {},
                },
                where: {
                    id: {
                        in: [1, 2]
                    }
                }
            })
        })
        test('skips child nesting', () => {
            const prisma_query = {
                select: {
                    grandparent: {
                        select: {
                            parent: {}
                        }
                    },
                }
            }

            const result = add_query_ownership_clauses('parent', ownership_paths, ownership_paths, 'id', [1, 2], prisma_query)

            expect(result).to.deep.equal({
                select: {
                    grandparent: {
                        where: {
                            id: {
                                in: [1, 2]
                            }
                        },
                        select: {
                            parent: {}
                        }
                    },
                },
                where: {
                    grandparent: {
                        is: {
                            id: {
                                in: [1, 2]
                            }
                        }
                    }
                }
            })
        })
        test('combines existing wheres', () => {
            const prisma_query = {
                where: {
                    id: {
                        gt: 1
                    }
                }
            }

            const result = add_query_ownership_clauses('parent', ownership_paths, ownership_paths, 'id', [1, 2], prisma_query)

            expect(result).to.deep.equal({
                where: {
                    AND: [{
                        grandparent: {
                            is: {
                                id: {
                                    in: [1, 2]
                                }
                            }
                        }
                    }, {
                        id: {
                            gt: 1
                        }
                    }]
                }
            })
        })
    })
    describe(combine_wheres.name, () => {
        test('handles all udnefined wheres', () => {
            const result = combine_wheres([undefined], 'AND')

            expect(result).to.equal(undefined)
        })
    })
    describe(get_ownership_path.name, () => {
        test('throws on unfound ownership path', () => {
            const ownerhips_paths: OwnershipPaths = {}

            expect(() => get_ownership_path(ownerhips_paths, 'test')).to.throw()
        })
    })
})