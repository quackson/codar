const automator = require('miniprogram-automator')

describe('grouplist团队列表页面测试', () => {
  let miniProgram;
  let page;

  // 运行测试前调用
  beforeAll(async () => {
    miniProgram = await automator.connect({
      wsEndpoint: 'ws://localhost:9420',
    });
    page = await miniProgram.reLaunch('../group_list/group_list');
    page.setData({
      created_groups:[
        {
          groupID:1,
          groupName:"Group1"
        },
        {
          groupID:2,
          groupName:"Group2"
        },      
        {
          groupID:3,
          groupName:"Group3"
        },
        {
          groupID:4,
          groupName:"Group4"
        },
        {
          groupID:5,
          groupName:"Group5"
        },
        {
          groupID:6,
          groupName:"Group6"
        },
        {
          groupID:7,
          groupName:"Group7"
        },
        {
          groupID:8,
          groupName:"Group8"
        },
        {
          groupID:9,
          groupName:"Group9"
        },
        {
          groupID:10,
          groupName:"Group10"
        }
      ],
      joined_groups:[
        {
          groupID:1,
          groupName:"Group1"
        },
        {
          groupID:2,
          groupName:"Group2"
        },      
        {
          groupID:3,
          groupName:"Group3"
        }
      ]
    })
  });

  // 运行测试后调用
  afterAll(() => {
    miniProgram.disconnect();
  });

  // 测试内容
  it("列表是否正常显示", async () => {
    const list = await page.$$('.cu-item');
    expect(list.length == 10).toBe(true);
  })

  it("点击团队是否可以跳转到团队日历页面", async () => {
    jest.setTimeout(20000);
    const card = await page.$('.cuIcon-group');
    await card.tap();
    await page.waitFor(1000);
    const currentPage = await miniProgram.currentPage();
    expect(currentPage.path).toContain('pages/calendar/group_calendar');
  })

});