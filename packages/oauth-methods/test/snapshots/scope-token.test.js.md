# Snapshot report for `test/scope-token.test.js`

The actual snapshot is saved in `scope-token.test.js.snap`.

Generated by [AVA](https://avajs.dev).

## README example

> Snapshot 1

    {
      account: {
        id: 1,
        login: 'octokit',
      },
      token: 'usertoken456',
    }

> Snapshot 2

    {
      clientId: 'lv1.1234567890abcdef',
      clientSecret: '1234567890abcdef12347890abcdef12345678',
      clientType: 'github-app',
      token: 'usertoken456',
    }

## passes `expires_at` through

> Snapshot 1

    {
      account: {
        id: 1,
        login: 'octokit',
      },
      expires_at: '2021-10-06T17:26:27Z',
      token: 'usertoken456',
    }

> Snapshot 2

    {
      clientId: 'lv1.1234567890abcdef',
      clientSecret: '1234567890abcdef12347890abcdef12345678',
      clientType: 'github-app',
      expiresAt: '2021-10-06T17:26:27Z',
      token: 'usertoken456',
    }