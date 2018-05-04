"use strict";

angular.module("app", ["ui.router", "ngCookies", "angularFileUpload"])
    .controller("loginCtrl", ["$rootScope", "$timeout", "$scope", "$http", "$state", "$cookies", function($rootScope, $timeout, $scope, $http, $state, $cookies) {
        $scope.loginData = {
            name: "",
            pwd: ""
        };

        //登录逻辑
        $scope.login = function(form) {
            //验证表单
            if (form.name.$error.required || form.name.$error.minlength || form.name.$error.maxlength) {
                $scope.msg = "请输入5-16位账号";
                $timeout(function() {
                    $scope.msg = "";
                }, 2666);
            } else if (form.pwd.$error.required || form.pwd.$error.minlength || form.pwd.$error.maxlength) {
                $scope.msg = "请输入6-16位密码";
                $timeout(function() {
                    $scope.msg = "";
                }, 2666);
            } else {
                //发送请求（跨域）
                $http.post("http://li949087638.w3.luyouxia.net/task5/a/login", $scope.loginData)
                    .then(function(res) {
                        if (res.data.code === 0) {
                            $scope.msg = "正在登陆...";
                            $cookies.put("login", true);
                            $cookies.put("records", { managerID: res.data.data.manager.id, roleID: res.data.data.role.id });
                            $state.go("main");
                        } else {
                            $scope.msg = res.data.message;
                            $timeout(function() {
                                $scope.msg = "";
                            }, 2666);
                        }
                    });
            }
        };
    }])
    .controller("mainCtrl", ["$scope", "$cookies", "$state", "$timeout", "$http", function($scope, $cookies, $state, $timeout, $http) {
        //导航栏内容数据
        $scope.navList = [
            { name: "信息管理", show: false, item: { "公司列表": "#/main/incList", "职位列表": "#/main/jobList" } },
            { name: "Article管理(可用)", show: false, item: { "Article列表(可用)": "#/main/artList", "文章管理": "#/main/artCtrl" } },
            { name: "用户管理", show: false, item: { "用户列表": "#/main/userList" } },
            { name: "内容管理", show: false, item: { "视频管理": "#/main/videoCtrl" } }
        ];

        //导航栏展开逻辑
        $scope.navOpen = function(a) {
            angular.forEach($scope.navList, function(obj) {
                if (obj.$$hashKey == a.$$hashKey) {
                    obj.show = !obj.show;
                } else {
                    obj.show = false;
                }
            });
        };
        $scope.navUrl = "";
        $scope.navSelect = function(y) {
            $timeout(function() {
                $scope.navUrl = $state.current.url;
            }, 100);
        };

        //退出登录
        $scope.logout = function() {
            $http.post("http://li949087638.w3.luyouxia.net/task5/a/logout")
                .then(function(response) {
                    if (response.data.code === 0) {
                        $cookies.remove("login");
                        $state.go("login");
                    } else {
                        alert("退出登录出错，请联系管理员");
                    }
                });
        };
    }])
    .controller("artListCtrl", ["$http", "$scope", function($http, $scope) {
        $scope.artData = {
            total: 0,
            size: 0
        };
        $scope.tempParams = {
            startAt: "",
            endAt: "",
            type: "",
            status: ""
        };
        $scope.searchParams = {
            page: 1,
            size: 10,
            startAt: "",
            endAt: "",
            type: "",
            status: ""
        };

        // 日期选择插件daterangepicker
        $('#date-range').daterangepicker({
            "locale": {
                format: 'YYYY-MM-DD',
                separator: ' ~ ',
                applyLabel: "应用",
                cancelLabel: "取消",
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                    '七月', '八月', '九月', '十月', '十一月', '十二月'
                ]
            }
        }, function(start, end) {
            $scope.tempParams.startAt = start.valueOf();
            $scope.tempParams.endAt = end.valueOf();
        });

        //article默认列表
        $scope.request = function() {
            $http.get("http://li949087638.w3.luyouxia.net/task5/a/article/search", { params: $scope.searchParams })
                .then(function(res) {
                    if (res.data.code === 0) {
                        $scope.artData = res.data.data;
                    } else {
                        alert("Article列表请求失败");
                    }
                });
        };

        // 初始化列表
        $scope.request();

        //清空搜索条件
        $scope.clear = function() {
            $scope.searchParams.page = 1;
            $scope.tempParams.startAt = "";
            $scope.tempParams.endAt = "";
            $scope.tempParams.type = "";
            $scope.tempParams.status = "";
            $scope.searchParams.startAt = "";
            $scope.searchParams.endAt = "";
            $scope.searchParams.type = "";
            $scope.searchParams.status = "";
            $scope.request();
        };

        //搜索
        $scope.search = function() {
            $scope.searchParams.page = 1;
            $scope.searchParams.startAt = $scope.tempParams.startAt;
            $scope.searchParams.endAt = $scope.tempParams.endAt;
            $scope.searchParams.type = $scope.tempParams.type;
            $scope.searchParams.status = $scope.tempParams.status;
            $scope.request();
        };

        $scope.offline = function(id) {
            if (confirm("是否执行下线操作？")) {
                var data = {
                    id: id,
                    status: 1
                };
                $http.put("http://li949087638.w3.luyouxia.net/task5/a/u/article/status", data)
                    .then(function(res) {
                        if (res.data.code === 0) {
                            alert("操作成功");
                            console.log(res.data);
                        } else {
                            alert("下线操作失败，请联系管理员");
                            console.log(res.data);
                        }
                    });
                $scope.request();
            }
        };

        $scope.online = function(id) {
            if (confirm("是否执行上线操作？")) {
                var data = {
                    id: id,
                    status: 2
                };
                $http.put("http://li949087638.w3.luyouxia.net/task5/a/u/article/status", data)
                    .then(function(res) {
                        if (res.data.code === 0) {
                            alert("操作成功");
                            console.log(res.data);
                        } else {
                            alert("上线操作失败，请联系管理员");
                            console.log(res.data);
                        }
                    });
                $scope.request();
            }
        };

        $scope.delete = function(id) {
            if (confirm("是否执行删除操作？")) {
                let url = "http://li949087638.w3.luyouxia.net/task5/a/u/article/" + id;
                $http.delete(url)
                    .then(function(res) {
                        if (res.data.code === 0) {
                            alert("操作成功");
                            console.log(res.data);
                        } else {
                            alert("删除操作失败，请联系管理员");
                            console.log(res.data);
                        }
                    });
                $scope.request();
            }
        };

        //根据总数和每页数量，确定页数，创建repeat数组，用于显示页码
        $scope.pages = () => Math.ceil($scope.artData.total / $scope.artData.size);
        $scope.repeat = () => {
            var a = [];
            if ($scope.pages() > 5) {
                if ($scope.searchParams.page < $scope.pages() - 4) {
                    for (let i = 0; i < 5; i++) {
                        a[i] = $scope.searchParams.page + i;
                    }
                    return a;
                } else {
                    for (let i = 0; i < 5; i++) {
                        a[i] = $scope.pages() - 4 + i;
                    }
                    return a;
                }
            } else {
                for (let i = 0; i < $scope.pages(); i++) {
                    a[i] = i + 1;
                }
                return a;
            }

        };

        //点击页码跳转页面
        $scope.pageJump = function(a) {
            if ($scope.searchParams.page != a) {
                $scope.searchParams.page = a;
                $scope.request();
            }
        };

        //上一页
        $scope.pagePrev = function() {
            if ($scope.searchParams.page > 1) {
                $scope.searchParams.page -= 1;
                $scope.request();
            }
        };

        //下一页
        $scope.pageNext = function() {
            if ($scope.searchParams.page < $scope.pages()) {
                $scope.searchParams.page += 1;
                $scope.request();
            }
        };

        //确定
        $scope.ok = function() {
            $scope.request();
        };

        //首页
        $scope.firstPage = function() {
            $scope.searchParams.page = 1;
            $scope.request();
        };

        //末页
        $scope.lastPage = function() {
            $scope.searchParams.page = $scope.pages();
            $scope.request();
        };
    }])
    .controller("artAddCtrl", ["$scope", "$stateParams", "$http", "FileUploader", "$state", function($scope, $stateParams, $http, FileUploader, $state) {
        $scope.artParams = {
            title: "",
            type: "",
            status: "",
            img: "",
            content: "",
            url: "",
            industry: "",
            createAt: "",
            updateAt: ""
        };

        // 判断是新增article，还是编辑article，id=-1代表新增，编辑则根据id请求数据并显示
        if ($stateParams.id != -1) {
            let url = "http://li949087638.w3.luyouxia.net/task5/a/article/" + $stateParams.id;
            $http.get(url)
                .then(function(res) {
                    if (res.data.code === 0) {
                        $scope.artParams.title = res.data.data.article.title;
                        $scope.artParams.type = res.data.data.article.type + '';
                        $scope.artParams.status = res.data.data.article.status;
                        $scope.artParams.img = res.data.data.article.img;
                        $scope.artParams.content = res.data.data.article.content;
                        $scope.artParams.url = res.data.data.article.url;
                        $scope.artParams.industry = res.data.data.article.industry;
                        $scope.artParams.createAt = res.data.data.article.createAt;
                        $scope.artParams.updateAt = res.data.data.article.updateAt;
                    } else {
                        console.log("Article获取出错");
                            console.log(res.data);
                    }
                });
        }

        // 图片上传插件
        $scope.uploader = new FileUploader({ url: "http://li949087638.w3.luyouxia.net/task5/a/u/img/task" });
        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if (status === 200) {
                $scope.artParams.img = response.data.url;
            } else {
                console.log("上传图片出错");
            }
        };

        // 向服务器发送请求，id=-1代表新增，否则为编辑
        $scope.request = function() {
            if ($stateParams.id != -1) {
                let url = "http://li949087638.w3.luyouxia.net/task5/a/u/article/" + $stateParams.id;
                $http.put(url, $scope.artParams)
                    .then(function(res) {
                        if (res.data.code === 0) {
                            alert("操作成功");
                            $state.go("main.artList");
                            console.log(res.data);
                        } else {
                            alert("操作失败，请联系管理员");
                            console.log(res.data);
                        }
                    });
            } else {
                $http.post("http://li949087638.w3.luyouxia.net/task5/a/u/article", $scope.artParams)
                    .then(function(res) {
                        if (res.data.code === 0) {
                            alert("操作成功");
                            $state.go("main.artList");
                            console.log(res.data);
                        } else {
                            alert("操作失败，请联系管理员");
                            console.log(res.data);
                        }
                    });
            }
        };

        // 发布上线
        $scope.online = function() {
            $scope.artParams.status = 2;
            $scope.request();
        };

        // 发布草稿
        $scope.draft = function() {
            $scope.artParams.status = 1;
            $scope.request();
        };
    }])
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("", "/login");
        $stateProvider

            //登录页
            .state("login", {
                url: "/login",
                templateUrl: "login.htm",
                controller: "loginCtrl"
            })

            //后台主页
            .state("main", {
                url: "/main",
                templateUrl: "main.htm",
                controller: "mainCtrl",
                controllerAs: "mainCtrl"
            })

            //article列表
            .state("main.artList", {
                url: "/artList",
                templateUrl: "artList.htm",
                controller: "artListCtrl"
            })

            //新增article
            .state("main.artAdd", {
                url: "/artAdd/:id",
                templateUrl: "artAdd.htm",
                controller: "artAddCtrl"
            })
            .state("main.incList", {
                url: "/incList",
                template: "<h2>暂无内容...</h2>"
            })
            .state("main.jobList", {
                url: "/jobList",
                template: "<h2>暂无内容...</h2>"
            })
            .state("main.artCtrl", {
                url: "/artCtrl",
                template: "<h2>暂无内容...</h2>"
            })
            .state("main.userList", {
                url: "/userList",
                template: "<h2>暂无内容...</h2>"
            })
            .state("main.videoCtrl", {
                url: "/videoCtrl",
                template: "<h2>暂无内容...</h2>"
            });
    }])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        //全局请求序列化
        $httpProvider.defaults.transformRequest = function(data) {
            if (data === undefined) {
                return data;
            }
            return $.param(data);
        };
    })
    .directive('editor', function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel) {
                // 初始化 编辑器内容
                if (!ngModel) {
                    return;
                } // do nothing if no ng-model
                // Specify how UI should be updated
                ngModel.$render = function() {
                    element.html(ngModel.$viewValue || '');
                };
                // Listen for change events to enable binding
                element.on('blur keyup change', function() {
                    scope.$apply(readViewText);
                });
                // No need to initialize, AngularJS will initialize the text based on ng-model attribute
                // Write data to the model
                function readViewText() {
                    var html = element.html();
                    // When we clear the content editable the browser leaves a <br> behind
                    // If strip-br attribute is provided then we strip this out
                    if (attrs.stripBr && html === '<br>') {
                        html = '';
                    }
                    ngModel.$setViewValue(html);
                }

                // 创建编辑器
                var editor = new wangEditor(element);
                editor.config.menuFixed = false;
                editor.config.menus = [
                    'bold',
                    'underline',
                    'italic',
                    'fontsize',
                    'head',
                    'unorderlist',
                    'orderlist',
                    'alignleft',
                    'aligncenter',
                    'alignright',
                    'link',
                    'table',
                    'insertcode',
                    'undo',
                    'redo'
                ];
                editor.create();
            }
        };
    })
    .filter('filterState', function() {
        var filter = function(status) {
            if (status == 1) {
                return "草稿";
            } else if (status == 2) {
                return "上线";
            }

        };
        return filter;
    })
    .filter('filterType', function() {
        var filter = function(type) {
            switch (type) {
                case 0:
                    return "首页Banner";
                case 1:
                    return "找职位Banner";
                case 2:
                    return "找精英Banner";
                case 3:
                    return "行业大图";
                default:
                    return "错误！";
            }
        };
        return filter;
    })
    .run(["$transitions", "$cookies", function($transitions, $cookies) {
        $transitions.onBefore({}, function(trans) {
            if (trans.to().name !== "login" && !$cookies.get("login")) {
                console.log("用户未登录,已自动跳转至登录界面");
                return trans.router.stateService.target('login');
            }
        });
    }]);