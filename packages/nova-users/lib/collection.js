/**
 * Telescope Users namespace
 * @namespace Users
 */
Users = Meteor.users;

/**
 * Vote schema
 * @type {SimpleSchema}
 */
Telescope.schemas.votes = new SimpleSchema({
  itemId: {
    type: String
  },
  power: {
    type: Number,
    optional: true
  },
  votedAt: {
    type: Date, 
    optional: true
  }
});

/**
 * User Data schema
 * @type {SimpleSchema}
 */
Telescope.schemas.userData = new SimpleSchema({
  /**
    Bio (Markdown version)
  */
  bio: {
    type: String,
    optional: true,
    control: "textarea",
    editableBy: ["member", "admin"],
    // autoform: {
    //   rows: 5
    // }
  },
  /**
    Total comment count
  */
  commentCount: {
    type: Number,
    public: true,
    optional: true
  },
  /**
    The name displayed throughout the app. Can contain spaces and special characters, doesn't need to be unique
  */
  displayName: {
    type: String,
    optional: true,
    public: true,
    profile: true,
    control: "text",
    editableBy: ["member", "admin"]
  },
  /**
    An array containing comment downvotes
  */
  downvotedComments: {
    type: [Telescope.schemas.votes],
    public: true,
    optional: true
  },
  /**
    An array containing posts downvotes
  */
  downvotedPosts: {
    type: [Telescope.schemas.votes],
    public: true,
    optional: true
  },
  /**
    The user's email. Modifiable.
  */
  email: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Email,
    required: true,
    control: "text",
    editableBy: ["member", "admin"]
    // unique: true // note: find a way to fix duplicate accounts before enabling this
  },
  /**
    A hash of the email, used for Gravatar // TODO: change this when email changes
  */
  emailHash: {
    type: String,
    public: true,
    optional: true
  },
  /**
    The HTML version of the bio field
  */
  htmlBio: {
    type: String,
    public: true,
    profile: true,
    optional: true,
    // autoform: {
    //   omit: true
    // },
    template: "user_profile_bio"
  },
  /**
    The user's karma
  */
  karma: {
    type: Number,
    decimal: true,
    public: true,
    optional: true
  },
  /**
    Total post count
  */
  postCount: {
    type: Number,
    public: true,
    optional: true
  },
  /**
    A blackbox modifiable object to store the user's settings
  */
  // settings: {
  //   type: Object,
  //   optional: true,
  //   editableBy: ["member", "admin"],
  //   blackbox: true,
  //   autoform: {
  //     omit: true
  //   }
  // },
  /**
    The user's profile URL slug // TODO: change this when displayName changes
  */
  slug: {
    type: String,
    public: true,
    optional: true
  },
  /**
    The user's Twitter username
  */
  twitterUsername: {
    type: String,
    optional: true,
    public: true,
    profile: true,
    control: "text",
    editableBy: ["member", "admin"],
    template: "user_profile_twitter"
  },
  /**
    An array containing comments upvotes
  */
  upvotedComments: {
    type: [Telescope.schemas.votes],
    public: true,
    optional: true
  },
  /**
    An array containing posts upvotes
  */
  upvotedPosts: {
    type: [Telescope.schemas.votes],
    public: true,
    optional: true
  },
  /**
    A link to the user's homepage
  */
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    public: true,
    profile: true,
    optional: true,
    control: "text",
    editableBy: ["member", "admin"]
  }
});

/**
 * Users schema
 * @type {SimpleSchema}
 */
Users.schema = new SimpleSchema({ 
  _id: {
    type: String,
    public: true,
    optional: true
  },
  username: {
    type: String,
    // regEx: /^[a-z0-9A-Z_]{3,15}$/,
    public: true,
    optional: true
  },
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  "emails.$.verified": {
    type: Boolean,
    optional: true
  },
  createdAt: {
    type: Date,
    public: true,
    optional: true
  },
  isAdmin: {
    type: Boolean,
    control: "checkbox",
    optional: true,
    editableBy: ["admin"],
    // autoform: {
    //   omit: true
    // }
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true
  },
  telescope: { // telescope-specific data
    type: Telescope.schemas.userData,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

// Meteor.startup(function(){
//   Users.internationalize();
// });

/**
 * Attach schema to Meteor.users collection
 */
Users.attachSchema(Users.schema);

Telescope.subscriptions.preload("users.current");


if (typeof Herald !== "undefined") {
  // Add notifications options to user profile settings
  Users.addField([
    {
      fieldName: 'telescope.notifications.users',
      fieldSchema: {
        label: 'New users',
        type: Boolean,
        optional: true,
        defaultValue: false,
        control: "checkbox",
        editableBy: ['admin'],
        autoform: {
          group: 'Email Notifications'
        }
      }
    },
    {
      fieldName: 'telescope.notifications.posts',
      fieldSchema: {
        label: 'New posts',
        type: Boolean,
        optional: true,
        defaultValue: false,
        control: "checkbox",
        editableBy: ['admin', 'member'],
        autoform: {
          group: 'Email Notifications'
        }
      }
    },
    {
      fieldName: 'telescope.notifications.comments',
      fieldSchema: {
        label: 'Comments on my posts',
        type: Boolean,
        optional: true,
        defaultValue: true,
        control: "checkbox",
        editableBy: ['admin', 'member'],
        autoform: {
          group: 'Email Notifications'
        }
      }
    },
    {
      fieldName: 'telescope.notifications.replies',
      fieldSchema: {
        label: 'Replies to my comments',
        type: Boolean,
        optional: true,
        defaultValue: true,
        control: "checkbox",
        editableBy: ['admin', 'member'],
        autoform: {
          group: 'Email Notifications'
        }
      }
    }
  ]);
}