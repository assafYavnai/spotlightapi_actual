define({ "api": [
  {
    "type": "get",
    "url": "/api/checks",
    "title": "All Check for dashboard.",
    "name": "AllCheck",
    "group": "Check",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>require latest acces token.</p>"
          }
        ]
      }
    },
    "description": "<p>provide list of all check created by user. If user has admin role, can access all users check.</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n    user_id: 1\n    check_master_code: 'CORE',\n    theme_id: 1,\n    name_en: 'Name of check',\n    description_en: 'Description of Check',\n    name_he: 'Name of check in hebrew',\n    description_he: 'Description of check if need to add',\n    is_active: true,\n    payment_completed: false,\n    start_date: '01-01-2011',\n    end_date: '01-04-2011',\n    tiny_url: 'https://sgoogle.com',\n    phone: '',\n    email: '',\n    conclusion: DataTypes.STRING,\n    is_pro_report_ready: DataTypes.BOOLEAN\n  }]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/db/sequelize/controllers/coreCheck.js",
    "groupTitle": "Check"
  },
  {
    "type": "post",
    "url": "/api/checkapp/report/:id",
    "title": "Generate Report for provided checkID.",
    "name": "ViewReport",
    "group": "CheckApplication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id of created check.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n    \"id\": 7,\n    \"user_id\": \"15\",\n    \"check_master_code\": \"CORE\",\n    \"theme_id\": 2,\n    \"name_en\": \"first core check\",\n    \"description_en\": null,\n    \"name_he\": null,\n    \"description_he\": null,\n    \"is_active\": true,\n    \"payment_completed\": true,\n    \"start_date\": \"2019-06-04T18:30:00.000Z\",\n    \"end_date\": \"2019-06-08T18:30:00.000Z\",\n    \"tiny_url\": \"ffdsfdsffsf-fdsfdsf-fsdfsdfsf-fdsfsd\",\n    \"phone\": \"9268310732\",\n    \"email\": \"munna@ferventsoft.com\",\n    \"created_on\": null,\n    \"updated_on\": null,\n    \"conclusion\": null,\n    \"is_pro_report_ready\": false,\n    \"createdAt\": \"2019-06-03T07:21:29.287Z\",\n    \"updatedAt\": \"2019-06-03T07:21:29.287Z\",\n    \"count\": \"4\",\n    \"optiona\": \"50\",\n    \"optionb\": \"50\",\n    \"optionc\": \"0\",\n    \"topics\": [\n        {\n            \"id\": 100,\n            \"user_check_id\": 7,\n            \"user_id\": \"15\",\n            \"topic_category_id\": 10,\n            \"text_en\": \"Does your team have business/management knowledge and capabilities? Please refer to the team you are part of and not the team that you manage\",\n            \"is_active\": true,\n            \"analysis\": null,\n            \"pro_score\": null,\n            \"createdAt\": \"2019-06-03T08:19:35.675Z\",\n            \"updatedAt\": \"2019-06-03T08:19:35.675Z\",\n            \"text_he\": null,\n            \"total_answer\": \"1\",\n            \"optiona\": \"100\",\n            \"optionb\": \"0\",\n            \"optionc\": \"0\",\n            \"comments\": [\n                {\n                    \"id\": 1,\n                    \"user_check_topic_id\": 100,\n                    \"user_id\": \"88bbf701-8828-11e9-9ae4-19f92fecea53\",\n                    \"answer\": \"Testing Answer\",\n                    \"choosen_option\": \"A\",\n                    \"taken_time\": 15,\n                    \"is_hilighted_answer\": false,\n                    \"createdAt\": \"2019-06-06T12:53:53.070Z\",\n                    \"updatedAt\": \"2019-06-06T12:53:53.070Z\"\n                }\n            ]\n        },\n        {\n            \"id\": 101,\n            \"user_check_id\": 7,\n            \"user_id\": \"15\",\n            \"topic_category_id\": 10,\n            \"text_en\": \"How is the communication and relationships with our team? Please refer to the team you are part of and not the team that you manage\",\n            \"is_active\": true,\n            \"analysis\": null,\n            \"pro_score\": null,\n            \"createdAt\": \"2019-06-03T08:19:35.675Z\",\n            \"updatedAt\": \"2019-06-03T08:19:35.675Z\",\n            \"text_he\": null,\n            \"total_answer\": \"2\",\n            \"optiona\": \"50\",\n            \"optionb\": \"50\",\n            \"optionc\": \"0\",\n            \"comments\": [\n                {\n                    \"id\": 3,\n                    \"user_check_topic_id\": 101,\n                    \"user_id\": \"88bbf701-8828-11e9-9ae4-19f92fecea53\",\n                    \"answer\": \"Testing Answer\",\n                    \"choosen_option\": \"B\",\n                    \"taken_time\": 15,\n                    \"is_hilighted_answer\": false,\n                    \"createdAt\": \"2019-06-06T13:27:52.649Z\",\n                    \"updatedAt\": \"2019-06-06T13:27:52.649Z\"\n                },\n                {\n                    \"id\": 5,\n                    \"user_check_topic_id\": 101,\n                    \"user_id\": \"88bbf701-8828-11e9-9ae4-19f92fecea53\",\n                    \"answer\": \"Testing Answersa\",\n                    \"choosen_option\": \"A\",\n                    \"taken_time\": 23,\n                    \"is_hilighted_answer\": true,\n                    \"createdAt\": \"2019-06-06T13:27:52.649Z\",\n                    \"updatedAt\": \"2019-06-06T13:27:52.649Z\"\n                }\n            ]\n        },\n        {\n            \"id\": 102,\n            \"user_check_id\": 7,\n            \"user_id\": \"15\",\n            \"topic_category_id\": 10,\n            \"text_en\": \"Does your organization have enough resources and focus to meet long term gains and planning?\",\n            \"is_active\": true,\n            \"analysis\": null,\n            \"pro_score\": null,\n            \"createdAt\": \"2019-06-03T08:19:35.675Z\",\n            \"updatedAt\": \"2019-06-03T08:19:35.675Z\",\n            \"text_he\": null,\n            \"total_answer\": \"1\",\n            \"optiona\": \"0\",\n            \"optionb\": \"100\",\n            \"optionc\": \"0\",\n            \"comments\": [\n                {\n                    \"id\": 2,\n                    \"user_check_topic_id\": 102,\n                    \"user_id\": \"88bbf701-8828-11e9-9ae4-19f92fecea53\",\n                    \"answer\": \"Testing Answer\",\n                    \"choosen_option\": \"B\",\n                    \"taken_time\": 15,\n                    \"is_hilighted_answer\": false,\n                    \"createdAt\": \"2019-06-06T13:27:45.511Z\",\n                    \"updatedAt\": \"2019-06-06T13:27:45.511Z\"\n                }\n            ]\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/db/sequelize/controllers/checkApplication.js",
    "groupTitle": "CheckApplication"
  },
  {
    "type": "post",
    "url": "/api/checkapp/getTopics",
    "title": "Fetch all topics and check inforamtion.",
    "name": "getTopics",
    "group": "CheckApplication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "checkUniqueId",
            "description": "<p>Uniqe ID genereted for CheckApplication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>Uniqe ID genereted for invited user.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n    \"invitation\": {\n        \"current_topic\": 0,\n        \"email\": \"munna@ferventsoft.com\",\n        \"is_completed\": false\n    },\n    \"check\": {\n        \"id\": 7,\n        \"user_id\": \"15\",\n        \"check_master_code\": \"CORE\",\n        \"theme_id\": 2,\n        \"name_en\": \"first core check\",\n        \"description_en\": null,\n        \"name_he\": null,\n        \"description_he\": null,\n        \"is_active\": true,\n        \"payment_completed\": true,\n        \"start_date\": \"2019-06-04T18:30:00.000Z\",\n        \"end_date\": \"2019-06-10T18:30:00.000Z\",\n        \"tiny_url\": \"ffdsfdsffsf-fdsfdsf-fsdfsdfsf-fdsfsd\",\n        \"phone\": \"9268310732\",\n        \"email\": \"munna@ferventsoft.com\",\n        \"created_on\": null,\n        \"updated_on\": null,\n        \"conclusion\": null,\n        \"is_pro_report_ready\": false,\n        \"createdAt\": \"2019-06-03T07:21:29.287Z\",\n        \"updatedAt\": \"2019-06-03T07:21:29.287Z\"\n    },\n    \"topics\": [\n        {\n            \"id\": 100,\n            \"user_check_id\": 7,\n            \"user_id\": \"15\",\n            \"topic_category_id\": 10,\n            \"text_en\": \"Does your team have business/management knowledge and capabilities? Please refer to the team you are part of and not the team that you manage\",\n            \"text_he\": null,\n            \"is_active\": true,\n            \"analysis\": null,\n            \"pro_score\": null,\n            \"createdAt\": \"2019-06-03T08:19:35.675Z\",\n            \"updatedAt\": \"2019-06-03T08:19:35.675Z\"\n        },\n        {\n            \"id\": 101,\n            \"user_check_id\": 7,\n            \"user_id\": \"15\",\n            \"topic_category_id\": 10,\n            \"text_en\": \"How is the communication and relationships with our team? Please refer to the team you are part of and not the team that you manage\",\n            \"text_he\": null,\n            \"is_active\": true,\n            \"analysis\": null,\n            \"pro_score\": null,\n            \"createdAt\": \"2019-06-03T08:19:35.675Z\",\n            \"updatedAt\": \"2019-06-03T08:19:35.675Z\"\n        },\n        {\n            \"id\": 102,\n            \"user_check_id\": 7,\n            \"user_id\": \"15\",\n            \"topic_category_id\": 10,\n            \"text_en\": \"Does your organization have enough resources and focus to meet long term gains and planning?\",\n            \"text_he\": null,\n            \"is_active\": true,\n            \"analysis\": null,\n            \"pro_score\": null,\n            \"createdAt\": \"2019-06-03T08:19:35.675Z\",\n            \"updatedAt\": \"2019-06-03T08:19:35.675Z\"\n        },\n        {\n            \"id\": 103,\n            \"user_check_id\": 7,\n            \"user_id\": \"15\",\n            \"topic_category_id\": 10,\n            \"text_en\": \"Does your organization provide enviable motivation to work in a team environment?\",\n            \"text_he\": null,\n            \"is_active\": true,\n            \"analysis\": null,\n            \"pro_score\": null,\n            \"createdAt\": \"2019-06-03T08:19:35.675Z\",\n            \"updatedAt\": \"2019-06-03T08:19:35.675Z\"\n        },\n        {\n            \"id\": 104,\n            \"user_check_id\": 7,\n            \"user_id\": \"15\",\n            \"topic_category_id\": 10,\n            \"text_en\": \"How do we perform as a team? Please refer to the team that you are part of and not to the team that you manage\",\n            \"text_he\": null,\n            \"is_active\": true,\n            \"analysis\": null,\n            \"pro_score\": null,\n            \"createdAt\": \"2019-06-03T08:19:35.675Z\",\n            \"updatedAt\": \"2019-06-03T08:19:35.675Z\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Error\nHTTP/1.1 404 Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/db/sequelize/controllers/checkApplication.js",
    "groupTitle": "CheckApplication"
  },
  {
    "type": "post",
    "url": "/api/checkapp/saveAnswer",
    "title": "Save Topic Answer",
    "name": "saveAnswer",
    "group": "CheckApplication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "checkUniqueId",
            "description": "<p>Uniqe ID genereted for CheckApplication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>Uniqe ID genereted for invited user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "topicId",
            "description": "<p>Answered topic ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "answer",
            "description": "<p>comments provided on topic.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "option",
            "description": "<p>selected option by user.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "takenTime",
            "description": "<p>used time to answer this topic.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Error\nHTTP/1.1 404 Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/db/sequelize/controllers/checkApplication.js",
    "groupTitle": "CheckApplication"
  },
  {
    "type": "post",
    "url": "/api/checks/core/add",
    "title": "Create or Update Check.",
    "name": "CreateOrUpdateCheck",
    "group": "Check",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>require latest acces token.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n      \"id\": 5,\n      \"check_master_code\": \"CORE\",\n      \"theme_id\": 2,\n      \"name_en\": \"first core check updaed\",\n      \"description_en\": null,\n      \"name_he\": null,\n      \"description_he\": null,\n      \"is_active\": null,\n      \"payment_completed\": false,\n      \"start_date\": \"2019-12-11T18:30:00.000Z\",\n      \"end_date\": \"2019-12-11T18:30:00.000Z\",\n      \"tiny_url\": null,\n      \"phone\": \"9268310732\",\n      \"email\": \"munna@ferventsoft.com\",\n      \"created_on\": null,\n      \"updated_on\": null,\n      \"conclusion\": null,\n      \"is_pro_report_ready\": false,\n      \"createdAt\": \"2019-06-03T07:16:00.464Z\",\n      \"updatedAt\": \"2019-06-03T07:16:00.464Z\"\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/db/sequelize/controllers/coreCheck.js",
    "groupTitle": "Check"
  },
  {
    "type": "post",
    "url": "/api/check/inviteusers",
    "title": "Invite users.",
    "name": "InviteUsers",
    "group": "Check",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>require latest acces token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "emails",
            "description": "<p>All all emails comma saperated.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>Content which need to send for inviting users.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tiny_url",
            "description": "<p>Urls for check Application.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "check_id",
            "description": "<p>Id of check for which user is going to invite.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/db/sequelize/controllers/checkInvitation.js",
    "groupTitle": "Check"
  },
  {
    "type": "get",
    "url": "/api/checks/pending",
    "title": "Last Pending check.",
    "name": "PendingCheck",
    "group": "Check",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>require latest acces token.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    user_id: 1\n    check_master_code: 'CORE',\n    theme_id: 1,\n    name_en: 'Name of check',\n    description_en: 'Description of Check',\n    name_he: 'Name of check in hebrew',\n    description_he: 'Description of check if need to add',\n    is_active: true,\n    payment_completed: false,\n    start_date: '01-01-2011',\n    end_date: '01-04-2011',\n    tiny_url: 'https://sgoogle.com',\n    phone: '',\n    email: '',\n    conclusion: DataTypes.STRING,\n    is_pro_report_ready: DataTypes.BOOLEAN\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/db/sequelize/controllers/coreCheck.js",
    "groupTitle": "Check"
  },
  {
    "type": "get",
    "url": "/api/themes",
    "title": "Request Theme information including category and topics.",
    "name": "AllTheme",
    "group": "Theme",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>require latest acces token.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    [\n          {\n              \"categoryName\":\"Human Resource\",\n              \"categoryID\":9,\n              \"themes\":[\n                {\n                    \"id\":2,\n                    \"category_id\":9,\n                    \"name_en\":\"theme2\",\n                    \"description_en\":null,\n                    \"name_he\":null,\n                    \"description_he\":null,\n                    \"is_active\":null,\n                    \"createdAt\":\"2019-05-31T15:20:48.460Z\",\n                    \"updatedAt\":\"2019-05-31T15:20:48.460Z\",\n                    \"topics\":[\n                      {\n                          \"id\":6,\n                          \"theme_id\":2,\n                          \"topic_category_id\":10,\n                          \"name_en\":\"Does your team have business/management knowledge and capabilities? Please refer to the team you are part of and not the team that you manage\",\n                          \"description_en\":null,\n                          \"name_he\":null,\n                          \"description_he\":null,\n                          \"is_active\":true,\n                          \"createdAt\":\"2019-05-30T14:02:47.916Z\",\n                          \"updatedAt\":\"2019-05-30T14:02:47.916Z\"\n                      },\n                      {\n                          \"id\":7,\n                          \"theme_id\":2,\n                          \"topic_category_id\":10,\n                          \"name_en\":\"How is the communication and relationships with our team? Please refer to the team you are part of and not the team that you manage\",\n                          \"description_en\":null,\n                          \"name_he\":null,\n                          \"description_he\":null,\n                          \"is_active\":true,\n                          \"createdAt\":\"2019-05-30T14:02:59.714Z\",\n                          \"updatedAt\":\"2019-05-30T14:02:59.714Z\"\n                      },\n                      {\n                          \"id\":8,\n                          \"theme_id\":2,\n                          \"topic_category_id\":10,\n                          \"name_en\":\"Does your organization have enough resources and focus to meet long term gains and planning?\",\n                          \"description_en\":null,\n                          \"name_he\":null,\n                          \"description_he\":null,\n                          \"is_active\":true,\n                          \"createdAt\":\"2019-05-30T14:03:11.444Z\",\n                          \"updatedAt\":\"2019-05-30T14:03:11.444Z\"\n                      },\n                      {\n                          \"id\":9,\n                          \"theme_id\":2,\n                          \"topic_category_id\":10,\n                          \"name_en\":\"Does your organization provide enviable motivation to work in a team environment?\",\n                          \"description_en\":null,\n                          \"name_he\":null,\n                          \"description_he\":null,\n                          \"is_active\":true,\n                          \"createdAt\":\"2019-05-30T14:05:32.306Z\",\n                          \"updatedAt\":\"2019-05-30T14:05:32.306Z\"\n                      },\n                      {\n                          \"id\":10,\n                          \"theme_id\":2,\n                          \"topic_category_id\":10,\n                          \"name_en\":\"How do we perform as a team? Please refer to the team that you are part of and not to the team that you manage\",\n                          \"description_en\":null,\n                          \"name_he\":null,\n                          \"description_he\":null,\n                          \"is_active\":true,\n                          \"createdAt\":\"2019-05-30T14:05:50.468Z\",\n                          \"updatedAt\":\"2019-05-30T14:05:50.468Z\"\n                      }\n                ]\n            }\n      ]\n   }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ThemesNotFound",
            "description": "<p>Themes are not avaialble.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ThemesNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/db/sequelize/controllers/themecategory.js",
    "groupTitle": "Theme"
  },
  {
    "type": "get",
    "url": "/api/user/verifyotp",
    "title": "OTP Verification",
    "name": "VerifyOTP",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>require OTP to verify email.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "otp",
            "description": "<p>require recent OTP sent on email.</p>"
          }
        ]
      }
    },
    "description": "<p>This API is created to validate OTP sent on email address.</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 NotFound",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/db/sequelize/controllers/users.js",
    "groupTitle": "User"
  }
] });
