"use strict";
const tslib_1 = require("tslib");
const faker_1 = tslib_1.__importDefault(require("faker"));
const { mock } = require("./data/mock")
const articleList = [];
const articleCount = 3;


for (let i = 0; i < articleCount; i++) {
    articleList.push({
        id: i,
        status: faker_1.default.random.arrayElement(['published', 'draft', 'deleted']),
        title: faker_1.default.lorem.sentence(6, 10),
    });
}

for (let i = 0; i < mock.length; i++) {
    articleList.push({
        id: mock[i].id,
        status: mock[i].status,
        title: mock[i].title
    });
}

console.log(articleList)