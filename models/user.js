module.exports = function (sequelize, Sequelize) {
    return sequelize.define('users', {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: Sequelize.STRING(24)
        },
        user_id: {
            type: Sequelize.BIGINT,
        },
        balance_data_source_1: {
            type: Sequelize.BIGINT,
        },
        balance_data_source_2: {
            type: Sequelize.BIGINT,
        },
        balance_data_source_3: {
            type: Sequelize.BIGINT,
        },


        balance_data_source_4: {
            type: Sequelize.BIGINT,
        },
        total_balance: {
            type: Sequelize.BIGINT,
        },
        created_at: {
            type: Sequelize.DATE
        },
        updated_at: {
            type: Sequelize.DATE
        }
    },
        {
            indexes: [
                {
                    unique: false,
                    fields: ['total_balance']
                },
                {
                    unique: false,
                    fields: ['created_at']
                }

            ]
        }
    )
}
