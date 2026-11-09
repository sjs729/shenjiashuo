/**
 * 作者：申家硕
 * 建立时间：2026-11-02
 * 使用模型：DeepSeek-V4.1-Flash
 * 功能名称：可复用 Tab 选项卡组件
 * 简介：为任意带 data-sjs-tabs 的容器提供选项卡切换；切换时先清除全部选中状态，
 *       再设置当前项，按钮与内容面板通过 data-sjs-tab / data-sjs-panel 一一对应。
 */
(function () {
    "use strict";

    /**
     * 切换选项卡
     * 功能：先清除容器内所有选项卡与面板的选中状态，再为当前项设置选中状态
     * @param {HTMLElement} sjs_root 选项卡容器
     * @param {string} sjs_key 目标项的标识，对应 data-sjs-tab 的值
     * @returns {void}
     */
    function sjs_activateTab(sjs_root, sjs_key) {
        var sjs_tabs = sjs_root.querySelectorAll(".sjs_tab");
        var sjs_panels = sjs_root.querySelectorAll(".sjs_panel");

        // 第一步：清除所有选项卡的选中状态
        sjs_tabs.forEach(function (sjs_tabItem) {
            sjs_tabItem.classList.remove("sjs_is_active");
            sjs_tabItem.setAttribute("aria-selected", "false");
            sjs_tabItem.tabIndex = -1;
        });

        // 同时把所有内容面板隐藏，避免同时出现两块内容
        sjs_panels.forEach(function (sjs_panelItem) {
            sjs_panelItem.hidden = true;
            sjs_panelItem.classList.remove("sjs_is_active");
        });

        // 第二步：找到当前项，并设置选中状态
        var sjs_targetTab = sjs_root.querySelector('.sjs_tab[data-sjs-tab="' + sjs_key + '"]');
        var sjs_targetPanel = sjs_root.querySelector('.sjs_panel[data-sjs-panel="' + sjs_key + '"]');

        if (!sjs_targetTab || !sjs_targetPanel) {
            return;
        }

        sjs_targetTab.classList.add("sjs_is_active");
        sjs_targetTab.setAttribute("aria-selected", "true");
        sjs_targetTab.tabIndex = 0;

        sjs_targetPanel.hidden = false;
        sjs_targetPanel.classList.add("sjs_is_active");
    }

    /**
     * 初始化单个选项卡容器
     * 功能：为每个按钮绑定点击事件，并按 HTML 中的默认选中项完成首次渲染
     * @param {HTMLElement} sjs_root 选项卡容器
     * @returns {void}
     */
    function sjs_initTabs(sjs_root) {
        var sjs_tabs = sjs_root.querySelectorAll(".sjs_tab");

        // 事件监听：点击按钮时，把该项的 data-sjs-tab 交给切换函数
        sjs_tabs.forEach(function (sjs_tabItem) {
            sjs_tabItem.addEventListener("click", function () {
                sjs_activateTab(sjs_root, sjs_tabItem.dataset.sjsTab);
            });
        });

        // 默认项优先读取 HTML 里带 sjs_is_active 的按钮，没有则取第一项
        var sjs_defaultTab = sjs_root.querySelector(".sjs_tab.sjs_is_active") || sjs_tabs[0];

        if (sjs_defaultTab) {
            sjs_activateTab(sjs_root, sjs_defaultTab.dataset.sjsTab);
        }
    }

    // 自动初始化页面上所有声明了 data-sjs-tabs 的容器，复用时不需再写额外代码
    document.querySelectorAll("[data-sjs-tabs]").forEach(function (sjs_rootItem) {
        sjs_initTabs(sjs_rootItem);
    });
})();
