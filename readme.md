### Kwickquick-Client


You can view the [kwickquick-API](https://github.com/Benrobo/kwickquick-API)
and the Scanner App [kwickquick-scanner](https://github.com/Benrobo/kwickquick-client-scanner)

### The organization dashboard



## ❤❤ Contributing

before making any pull request, make sure you follow the steps below

#### ✅ clone the repo to your PC
This is the simplest part of Git. Navigate to your forked repository (the repository is now one of your GitHub repositories). Follow steps 1 and 2 as shown in the image below to copy the clone address.

Then, clone the project by typing git clone <the copied address> into your command terminal as shown below:

```javascript
    git clone https://github.com/Benrobo/kickquick-client.git
```

#### 💎 Create the branch you want to work on.
The upstream is necessary to keep track of the difference between the forked repository that is on your Git account and the original repository.
It is nice to create a new branch whenever you want to contribute. This illustrates that the branch is only for that contribution you are about to make. It could be as small as fixing a typo or as large as implementing a new feature. Either way, it’s good practice to create a branch.

Another important part of the branch creation is naming. It is pleasing to use a name that a stranger who knows nothing about the repository can easily understand. If you want to add a login feature, for example, you could create a branch called add-login-feature or login-feature.

To create a branch type the following command into your terminal:

```javascript
    git checkout -b login-feature
    // Note do not use main has your branch name, cause that where the original and production code resides in
```


#### 💕 Git add and commit your contributions
This is quite simple as well. Stage and commit your changes by typing the following into your terminal.

```javascript
    git add .

    git commit -m 'Commit message'
```
Now, you have the changes staged and committed. What next?

#### 🎗💖 Push to the branch you’re working on
Now, you are almost there. Push your changes to the branch you are working on as shown below:

```javascript
    git push origin <branch-name>
    // eg git push origin login-feature
```

#### 🎉 Open a pull request
To open a pull request, navigate to the forked repository as shown below. You’ll see your last push branch ‘login-feature’, then click on ‘compare and pull request’.

And that’s it. :) You can now go ahead and contribute like a PRO!