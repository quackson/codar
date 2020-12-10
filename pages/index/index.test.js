const automator = require('miniprogram-automator')

describe('index页面测试', () => {
  let miniProgram;
  let page;
  // 运行测试前调用
  beforeAll(async () => {
    miniProgram = await automator.connect({
      wsEndpoint: 'ws://localhost:9420',
    });
    page = await miniProgram.reLaunch('../index/index');
  });

  // 运行测试后调用
  afterAll(() => {
    miniProgram.disconnect();
  });

  // 测试内容

  it("点击团队列表tab是否可以跳转到团队列表页面", async () => {
    jest.setTimeout(20000);
    const grouplist = await page.$('.cuIcon-group');
    await grouplist.tap();
    await page.waitFor(1000);
    const currentPage = await miniProgram.currentPage();
    expect(currentPage.path).toContain('pages/group_list/group_list');
    page = await miniProgram.reLaunch('../index/index');
  })

  it("点击创建团队tab是否可以跳转到创建团队页面", async () => {
    jest.setTimeout(20000);
    const creategroup = await page.$('.cuIcon-add');
    await creategroup.tap();
    await page.waitFor(1000);
    const currentPage = await miniProgram.currentPage();
    expect(currentPage.path).toContain('pages/create_group/create_group');
    page = await miniProgram.reLaunch('../index/index');
  })

  it("点击个人日历tab是否可以跳转到个人日历页面", async () => {
    jest.setTimeout(20000);
    const personalcalendar = await page.$('.cuIcon-calendar');
    await personalcalendar.tap();
    await page.waitFor(1000);
    const currentPage = await miniProgram.currentPage();
    expect(currentPage.path).toContain('pages/calendar/personal_calendar');
    page = await miniProgram.reLaunch('../index/index');
  })

  it("点击消息tab是否可以跳转到消息页面", async () => {
    jest.setTimeout(20000);
    const message = await page.$('.cuIcon-message');
    await message.tap();
    await page.waitFor(1000);
    const currentPage = await miniProgram.currentPage();
    expect(currentPage.path).toContain('pages/information/information');
    page = await miniProgram.reLaunch('../index/index');
  })
});