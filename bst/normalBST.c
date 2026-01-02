#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* ===============================
   BST NODE DEFINITION
   =============================== */
struct Node {
    char name[50];
    struct Node *left;
    struct Node *right;
};

/* ===============================
   CREATE NEW NODE
   =============================== */
struct Node* createNode(char name[]) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    strcpy(newNode->name, name);
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

/* ===============================
   INSERT CONTACT INTO BST
   =============================== */
struct Node* insert(struct Node* root, char name[]) {
    if (root == NULL) {
        return createNode(name);
    }

    if (strcmp(name, root->name) < 0) {
        root->left = insert(root->left, name);
    } 
    else if (strcmp(name, root->name) > 0) {
        root->right = insert(root->right, name);
    }
    // Duplicate names are ignored

    return root;
}

/* ===============================
   SEARCH CONTACT
   =============================== */
int search(struct Node* root, char key[]) {
    if (root == NULL)
        return 0;

    if (strcmp(key, root->name) == 0)
        return 1;

    if (strcmp(key, root->name) < 0)
        return search(root->left, key);
    else
        return search(root->right, key);
}

/* ===============================
   INORDER TRAVERSAL
   =============================== */
void inorder(struct Node* root) {
    if (root == NULL)
        return;

    inorder(root->left);
    printf("%s\n", root->name);
    inorder(root->right);
}

/* ===============================
   MAIN MENU
   =============================== */
int main() {
    struct Node* root = NULL;
    int choice;
    char name[50];

    while (1) {
        printf("\n--- CONTACT BST MENU ---\n");
        printf("1. Insert Contact\n");
        printf("2. Search Contact\n");
        printf("3. Display Contacts (Inorder)\n");
        printf("4. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
        case 1:
            printf("Enter contact name: ");
            scanf("%s", name);
            root = insert(root, name);
            printf("Contact inserted successfully.\n");
            break;

        case 2:
            printf("Enter contact name to search: ");
            scanf("%s", name);
            if (search(root, name))
                printf("Contact FOUND.\n");
            else
                printf("Contact NOT FOUND.\n");
            break;

        case 3:
            printf("\nContacts in alphabetical order:\n");
            inorder(root);
            break;

        case 4:
            printf("Exiting program.\n");
            exit(0);

        default:
            printf("Invalid choice. Try again.\n");
        }
    }

    return 0;
}
